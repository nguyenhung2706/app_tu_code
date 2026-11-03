import { createContext, useContext, useState, ReactNode } from 'react';

type AttendanceState = {
  isWorking: boolean;
  checkInTime: Date | null;
  checkOutTime: Date | null;
  checkInPhoto: string | null;
  checkIn: (photoUri: string) => void;
  checkOut: () => void;
};

const AttendanceContext = createContext<AttendanceState | undefined>(undefined);

export function AttendanceProvider({ children }: { children: ReactNode }) {
  const [isWorking, setIsWorking] = useState(false);
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<Date | null>(null);
  const [checkInPhoto, setCheckInPhoto] = useState<string | null>(null);

  const checkIn = (photoUri: string) => {
    setCheckInPhoto(photoUri);
    setCheckInTime(new Date());
    setCheckOutTime(null);
    setIsWorking(true);
  };

  const checkOut = () => {
    setCheckOutTime(new Date());
    setIsWorking(false);
  };

  return (
    <AttendanceContext.Provider
      value={{ isWorking, checkInTime, checkOutTime, checkInPhoto, checkIn, checkOut }}
    >
      {children}
    </AttendanceContext.Provider>
  );
}

export function useAttendance() {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance phải được dùng bên trong AttendanceProvider');
  }
  return context;
}