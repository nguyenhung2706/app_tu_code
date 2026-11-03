require('dotenv').config();

const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4'
});

app.get('/', (req, res) => {
  res.json({ message: 'Backend app quan ly dang hoat dong!' });
});

app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT DATABASE() AS database_name');
    res.json({ success: true, message: 'Ket noi MySQL thanh cong!', database: rows[0].database_name });
  } catch (error) {
    console.error('Loi ket noi MySQL:', error.message);
    res.status(500).json({ success: false, message: 'Khong ket noi duoc MySQL' });
  }
});

// ===== ĐĂNG NHẬP =====
app.post('/api/login', async (req, res) => {
  try {
    const { email, password, role, employeeCode } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Thieu email hoac mat khau' });
    }

    const [rows] = await db.query(
      `SELECT employee_id, full_name, email, position, department, role, status,
              password_hash, employee_code
       FROM employees WHERE email = ?`,
      [email.trim()]
    );
    const u = rows[0];

    if (!u || !u.password_hash) {
      return res.status(401).json({ success: false, message: 'Sai email hoac mat khau' });
    }

    const ok = await bcrypt.compare(password, u.password_hash);
    if (!ok) {
      return res.status(401).json({ success: false, message: 'Sai email hoac mat khau' });
    }

    if (u.status !== 'Đang làm việc') {
      return res.status(403).json({ success: false, message: 'Tai khoan dang nghi' });
    }

    // Kiểm tra đúng tab vai trò đã chọn
    if (role) {
      const expected = role === 'manager' ? 'manager' : 'employee';
      if (u.role !== expected) {
        return res.status(403).json({
          success: false,
          message: `Tai khoan nay khong phai ${role === 'manager' ? 'Quan Ly' : 'Nhan Vien'}`
        });
      }
    }

    // Kiểm tra mã nhân viên / quản lý
    if (employeeCode) {
      const dbCode = (u.employee_code || '').toLowerCase();
      if (dbCode !== employeeCode.trim().toLowerCase()) {
        return res.status(401).json({ success: false, message: 'Ma khong dung' });
      }
    }

    const token = jwt.sign(
      { id: u.employee_id, role: u.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: u.employee_id,
        name: u.full_name,
        email: u.email,
        position: u.position,
        department: u.department,
        role: u.role,
        code: u.employee_code
      }
    });
  } catch (error) {
    console.error('Loi dang nhap:', error.message);
    res.status(500).json({ success: false, message: 'Loi server' });
  }
});

// Middleware kiểm tra token
function auth(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Chua dang nhap' });
  }
}

app.get('/api/me', auth, async (req, res) => {
  const [rows] = await db.query(
    `SELECT employee_id AS id, full_name AS name, email, position, department, role,
            employee_code AS code
     FROM employees WHERE employee_id = ?`,
    [req.user.id]
  );
  res.json(rows[0]);
});

app.get('/api/employees', auth, async (req, res) => {
  const cols = `employee_id AS id, full_name AS name, status, department, position,
                email, birthday, join_date AS joinDate, phone, address, role,
                employee_code AS code`;
  if (req.user.role === 'manager') {
    const [rows] = await db.query(`SELECT ${cols} FROM employees ORDER BY employee_id`);
    return res.json(rows);
  }
  const [rows] = await db.query(`SELECT ${cols} FROM employees WHERE employee_id = ?`, [req.user.id]);
  res.json(rows);
});

const PORT = Number(process.env.PORT || 3000);

app.listen(PORT, () => {
  console.log(`Backend dang chay tai http://localhost:${PORT}`);
});