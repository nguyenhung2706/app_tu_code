import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/utils/config';

export type User = {
  id: number;
  name: string;
  email: string;
  position: string;
  department: string;
  role: 'manager' | 'employee';
  code?: string;
};

type LoginResult = { ok: boolean; message?: string };

type AuthValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (
    email: string,
    password: string,
    role?: string,
    employeeCode?: string
  ) => Promise<LoginResult>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthValue>({} as AuthValue);

const REQUEST_TIMEOUT = 10000; // 10 giây

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Khôi phục phiên đăng nhập khi mở app
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const savedToken = await AsyncStorage.getItem('token');
        const savedUser = await AsyncStorage.getItem('user');

        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.log('Lỗi khôi phục phiên đăng nhập:', error);
        await AsyncStorage.multiRemove(['token', 'user']);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // Đăng nhập
  const login: AuthValue['login'] = async (
    email,
    password,
    role,
    employeeCode
  ) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const url = `${API_URL}/api/login`;
      console.log('LOGIN URL:', url);

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role, employeeCode }),
        signal: controller.signal,
      });

      const data = await res.json();
      console.log('LOGIN STATUS:', res.status);
      console.log('LOGIN RESPONSE:', data);

      if (!res.ok || !data.success) {
        return { ok: false, message: data.message || 'Đăng nhập thất bại' };
      }

      if (!data.token || !data.user) {
        return {
          ok: false,
          message: 'Máy chủ chưa trả về token hoặc thông tin người dùng',
        };
      }

      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));

      setToken(data.token);
      setUser(data.user);

      console.log('AUTH USER SET:', data.user.role);
      return { ok: true };
    } catch (e: any) {
      console.log('LOGIN ERROR:', e?.name, e?.message);

      if (e?.name === 'AbortError') {
        return {
          ok: false,
          message: 'Máy chủ phản hồi quá lâu, kiểm tra lại địa chỉ API',
        };
      }
      return { ok: false, message: 'Không kết nối được máy chủ' };
    } finally {
      clearTimeout(timer);
    }
  };

  // Đăng xuất
  const logout = async () => {
      console.log('LOGOUT BI GOI TU:', new Error().stack);
    try {
      await AsyncStorage.multiRemove(['token', 'user']);
    } catch (e) {
      console.log('Lỗi khi đăng xuất:', e);
    } finally {
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);