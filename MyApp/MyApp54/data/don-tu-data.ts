export type RequestStatus = 'Chờ duyệt' | 'Đã duyệt' | 'Từ chối';
export type LeaveRequest = {
  id: string;
  employeeName: string;
  type: string;
  date: string;
  reason: string;
    status: RequestStatus;
};

export const leaveRequests: LeaveRequest[] = [
  {
    id: '1',
    employeeName: 'Nguyễn Văn A',
    type: 'Nghỉ phép',
    date: '2023-09-01',
    reason: 'Đi du lịch',
    status: 'Chờ duyệt'
  },
  {
    id: '2',
    employeeName: 'Trần Thị B',
    type: 'Nghỉ ốm',
    date: '2023-09-02',
    reason: 'Bị cảm',
    status: 'Đã duyệt'
  },
  {
    id: '3',
    employeeName: 'Lê Văn C',
    type: 'Nghỉ phép',
    date: '2023-09-03',
    reason: 'Đi công tác',
    status: 'Từ chối'
  },
  {
    id: '4',
    employeeName: 'Phạm Thị D',
    type: 'Nghỉ phép',
    date: '2023-09-04',
    reason: 'Đi du lịch',
    status: 'Chờ duyệt'
  },
  {
    id: '5',
    employeeName: 'Nguyễn Văn E',
    type: 'Nghỉ ốm',
    date: '2023-09-05',
    reason: 'Bị đau bụng',
    status: 'Chờ duyệt'
  },
  {
    id: '6',
    employeeName: 'Trần Thị F',
    type: 'Nghỉ phép', 
    date: '2023-09-06',
    reason: 'Đi du lịch',
    status: 'Đã duyệt'
  },
  {
    id: '7',
    employeeName: 'Lê Văn G',
    type: 'Nghỉ ốm',
    date: '2023-09-07',
    reason: 'Bị cảm',
    status: 'Từ chối'
  },
  {
    id: '8',
    employeeName: 'Phạm Thị H',
    type: 'Nghỉ phép', 
    date: '2023-09-08',
    reason: 'Đi công tác',
    status: 'Chờ duyệt'
  },
  {
    id: '9',
    employeeName: 'Nguyễn Văn I',
    type: 'Nghỉ phép',
    date: '2023-09-09',
    reason: 'Đi du lịch',
    status: 'Đã duyệt'
  },
  {
    id: '10',
    employeeName: 'Trần Thị J',
    type: 'Nghỉ ốm',
    date: '2023-09-10',
    reason: 'Bị đau bụng',
    status: 'Chờ duyệt'
  }, 
];