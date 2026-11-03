require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

(async () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  const initialPassword = process.env.INITIAL_PASSWORD;

if (!initialPassword) {
  throw new Error('Chua khai bao INITIAL_PASSWORD trong .env');
}

const hash = await bcrypt.hash(initialPassword, 10);
  const [r] = await pool.query(
    'UPDATE employees SET password_hash = ? WHERE employee_id > 0',
    [hash]
  );
  console.log('Da dat mat khau cho', r.affectedRows, 'nhan vien');
  process.exit();
})();