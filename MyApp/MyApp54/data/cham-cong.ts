export type AttendanceStatus = 'Đúng giờ' | 'Đi muộn' | 'Nghỉ phép' | 'Nghỉ';

export const attendanceRecords = [
    {
        id: '1',
        name: 'Nguyễn Văn A',
        checkInTime: '08:00',
        checkOutTime: '17:00',
        status: 'Đúng giờ' as AttendanceStatus,
    },
    {   
        id: '2',
        name: 'Trần Thị B',
        checkInTime: '08:15',
        checkOutTime: '17:00',
        status: 'Đi muộn' as AttendanceStatus,
    },
    {
        id: '3',
        name: 'Lê Văn C',
        checkInTime: '08:00',
        checkOutTime: '17:00',
        status: 'Nghỉ phép' as AttendanceStatus,
    },
    {
        id: '4',
        name: 'Phạm Thị D',
        checkInTime: '08:00',
        checkOutTime: '17:00',
        status: 'Nghỉ' as AttendanceStatus,
    },
];