
const pad = (n: number) => String(n).padStart(2, '0');

// Dạng 'YYYY-MM-DD' (thư viện lịch cần định dạng này)
export const getToday = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

// Dạng 'DD/MM/YYYY'
export const getTodayDMY = () => {
  const d = new Date();
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};

// Dạng 'Thứ Năm, 08/10/2026'
export const formatTodayVN = () => {
  const days = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const d = new Date();
  return `${days[d.getDay()]}, ${getTodayDMY()}`;
};