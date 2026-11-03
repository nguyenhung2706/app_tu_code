import * as SQLite from 'expo-sqlite';
import * as Crypto from 'expo-crypto';

// ====== TÀI KHOẢN MẪU (chỉ dùng để tạo sẵn lần đầu mở app) ======
// Mật khẩu mặc định ai cũng là 123456, đăng nhập xong nhớ đổi ở màn hình "Đổi mật khẩu"
const DEFAULT_PASSWORD = '123456';
const SEED_USERS = [
  { maNV: 'QL001', username: 'ql001', name: 'Nguyễn Văn B', role: 'manager' },
  { maNV: 'NV001', username: 'nv001', name: 'Trần Thị C', role: 'staff' },
  { maNV: 'NV002', username: 'nv002', name: 'Lê Văn D', role: 'staff' },
  { maNV: 'NV003', username: 'nv003', name: 'Phạm Thị E', role: 'staff' },
  { maNV: 'NV004', username: 'nv004', name: 'Hoàng Văn F', role: 'staff' },
  { maNV: 'NV005', username: 'nv005', name: 'Vũ Thị G', role: 'staff' },
  { maNV: 'NV006', username: 'nv006', name: 'Đặng Văn H', role: 'staff' },
  { maNV: 'NV007', username: 'nv007', name: 'Bùi Thị I', role: 'staff' },
  { maNV: 'NV008', username: 'nv008', name: 'Ngô Văn K', role: 'staff' },
];

export type User = {
  id: number;
  maNV: string;
  username: string;
  name: string;
  role: 'manager' | 'staff';
};

// ====== MÃ HÓA MẬT KHẨU ======
// Dùng SHA-256 + tên đăng nhập làm "muối" để 2 người trùng mật khẩu vẫn ra chuỗi khác nhau.
// Đủ cho dự án cá nhân. Làm hệ thống thật thì nên dùng bcrypt ở phía server.
async function hashPassword(username: string, password: string) {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${username.toLowerCase()}:${password}`
  );
}

// ====== MỞ DATABASE (chỉ mở 1 lần) ======
let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export function getDb() {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync('nhansu.db');

      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          maNV TEXT NOT NULL UNIQUE,
          username TEXT NOT NULL UNIQUE,
          password_hash TEXT NOT NULL,
          name TEXT NOT NULL,
          role TEXT NOT NULL CHECK (role IN ('manager', 'staff'))
        );

        CREATE TABLE IF NOT EXISTS shift_registrations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          date TEXT NOT NULL,
          shift TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'pending',
          note TEXT,
          UNIQUE (user_id, date, shift),
          FOREIGN KEY (user_id) REFERENCES users(id)
        );
      `);

      // Chèn tài khoản mẫu nếu bảng users đang trống
      const row = await db.getFirstAsync<{ n: number }>('SELECT COUNT(*) AS n FROM users');
      if (!row || row.n === 0) {
        for (const u of SEED_USERS) {
          const hash = await hashPassword(u.username, DEFAULT_PASSWORD);
          await db.runAsync(
            'INSERT INTO users (maNV, username, password_hash, name, role) VALUES (?, ?, ?, ?, ?)',
            [u.maNV, u.username, hash, u.name, u.role]
          );
        }
      }
      return db;
    })();
  }
  return dbPromise;
}

// ====== ĐĂNG NHẬP ======
// Trả về thông tin người dùng nếu đúng, trả về null nếu sai
export async function login(username: string, password: string): Promise<User | null> {
  const db = await getDb();
  const hash = await hashPassword(username.trim(), password);
  const user = await db.getFirstAsync<User>(
    'SELECT id, maNV, username, name, role FROM users WHERE username = ? AND password_hash = ?',
    [username.trim().toLowerCase(), hash]
  );
  return user ?? null;
}

// ====== ĐỔI MẬT KHẨU ======
// Trả về true nếu đổi được, false nếu mật khẩu cũ sai
export async function changePassword(
  username: string,
  oldPassword: string,
  newPassword: string
): Promise<boolean> {
  const db = await getDb();
  const oldHash = await hashPassword(username, oldPassword);
  const found = await db.getFirstAsync<{ id: number }>(
    'SELECT id FROM users WHERE username = ? AND password_hash = ?',
    [username.toLowerCase(), oldHash]
  );
  if (!found) return false;

  const newHash = await hashPassword(username, newPassword);
  await db.runAsync('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, found.id]);
  return true;
}

// ====== ĐĂNG KÝ CA ======
// Gửi danh sách ca đã chọn, mỗi phần tử có dạng '2026-10-19_sang'
export async function saveShiftRegistrations(userId: number, keys: string[], note: string) {
  const db = await getDb();
  for (const key of keys) {
    const [date, shift] = key.split('_');
    await db.runAsync(
      'INSERT OR IGNORE INTO shift_registrations (user_id, date, shift, status, note) VALUES (?, ?, ?, ?, ?)',
      [userId, date, shift, 'pending', note]
    );
  }
}

// Lấy các ca đã đăng ký của 1 người, dạng { key: '2026-10-19_sang', status: 'pending' }
export async function getShiftRegistrations(userId: number) {
  const db = await getDb();
  const rows = await db.getAllAsync<{ date: string; shift: string; status: string }>(
    'SELECT date, shift, status FROM shift_registrations WHERE user_id = ?',
    [userId]
  );
  return rows.map((r) => ({ key: `${r.date}_${r.shift}`, status: r.status }));
}