import { createContext, useContext, useState, ReactNode } from 'react';

export type LeaveRequestStatus = 'Chờ duyệt' | 'Đã duyệt' | 'Từ chối';
export type RequestKind = 'nghi-phep' | 'muon-som' | 'lam-them' | 'doi-ca' | 'quen-cham';

export type LeaveRequest = {
  id: string;
  kind: RequestKind;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveRequestStatus;
  details?: Record<string, string>;
};

type LeaveRequestState = {
  requests: LeaveRequest[];
  addRequest: (req: Omit<LeaveRequest, 'id' | 'status' | 'kind'> & { kind?: RequestKind }) => void;
};

const LeaveRequestContext = createContext<LeaveRequestState | undefined>(undefined);

export function LeaveRequestProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<LeaveRequest[]>([
    {
      id: '1',
      kind: 'nghi-phep',
      type: 'Xin nghỉ phép',
      startDate: '20/08/2026',
      endDate: '20/08/2026',
      reason: 'Có việc gia đình',
      status: 'Chờ duyệt',
    },
    {
      id: '2',
      kind: 'nghi-phep',
      type: 'Xin nghỉ phép',
      startDate: '15/08/2026',
      endDate: '15/08/2026',
      reason: 'Khám sức khỏe',
      status: 'Đã duyệt',
    },
    {
      id: '3',
      kind: 'nghi-phep',
      type: 'Xin nghỉ phép',
      startDate: '05/08/2026',
      endDate: '05/08/2026',
      reason: 'Việc cá nhân',
      status: 'Từ chối',
    },
  ]);

  const addRequest = (req: Omit<LeaveRequest, 'id' | 'status' |'kind'> & { kind?: RequestKind }) => {
    const newRequest: LeaveRequest = {
      ...req,
      kind: req.kind ?? 'nghi-phep',
      id: Date.now().toString(),
      status: 'Chờ duyệt',
    };
    setRequests((prev) => [newRequest, ...prev]);
  };

  return (
    <LeaveRequestContext.Provider value={{ requests, addRequest }}>
      {children}
    </LeaveRequestContext.Provider>
  );
}

export function useLeaveRequests() {
  const context = useContext(LeaveRequestContext);
  if (!context) {
    throw new Error('useLeaveRequests phải được dùng bên trong LeaveRequestProvider');
  }
  return context;
}