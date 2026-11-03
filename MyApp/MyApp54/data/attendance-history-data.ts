export type AttendanceRecord = {
  date: string; // định dạng 'YYYY-MM-DD'
  checkIn: string;
  checkOut: string;
  status: 'Đúng giờ' | 'Đi muộn' | 'Nghỉ';
};

export const attendanceHistory: AttendanceRecord[] = [
  { date: '2026-08-18', checkIn: '08:02', checkOut: '17:02', status: 'Đúng giờ' },
  { date: '2026-08-17', checkIn: '07:55', checkOut: '17:01', status: 'Đúng giờ' },
  { date: '2026-08-16', checkIn: '--:--', checkOut: '--:--', status: 'Nghỉ' },
  { date: '2026-08-15', checkIn: '08:20', checkOut: '17:05', status: 'Đi muộn' },
  { date: '2026-08-14', checkIn: '08:00', checkOut: '17:00', status: 'Đúng giờ' },
    { date: '2026-08-13', checkIn: '08:10', checkOut: '17:00', status: 'Đi muộn' },
    { date: '2026-08-12', checkIn: '--:--', checkOut: '--:--', status: 'Nghỉ' },
    { date: '2026-08-11', checkIn: '08:05', checkOut: '17:00', status: 'Đúng giờ' },
    { date: '2026-08-10', checkIn: '08:15', checkOut: '17:00', status: 'Đi muộn' },
    { date: '2026-08-09', checkIn: '--:--', checkOut: '--:--', status: 'Nghỉ' },
    
];