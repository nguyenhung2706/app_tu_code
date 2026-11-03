import { createContext, useContext, useState, ReactNode } from 'react';

export type TaskStatus = 'Chưa Làm' | 'Đã Làm' | 'Hoàn Thành';

export type Task = {
    id: string;
    title: string;
    deadline: string;
    status: TaskStatus;
};

type TaskState = {
    tasks: Task[];
    updateTaskStatus: (id: string, status: TaskStatus) => void;
};

const TaskContext = createContext<TaskState | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
    const [tasks, setTasks] = useState<Task[]>([
            { id: '1', title: 'Hoàn thành báo cáo', deadline: '20/08/2026', status: 'Chưa Làm' },
            { id: '2', title: 'Gửi email cho khách hàng', deadline: '15/08/2026', status: 'Đã Làm' },
            { id: '3', title: 'Chuẩn bị thuyết trình', deadline: '05/08/2026', status: 'Hoàn Thành' },
            { id: '4', title: 'Cập nhật dữ liệu', deadline: '10/08/2026', status: 'Chưa Làm' },
            { id: '5', title: 'Kiểm tra tiến độ dự án', deadline: '12/08/2026', status: 'Đã Làm' },
            { id: '6', title: 'Họp nhóm', deadline: '18/08/2026', status: 'Hoàn Thành' },
            {id: '7', title: 'Phân tích dữ liệu', deadline: '22/08/2026', status: 'Chưa Làm' },
            {id: '8', title: 'Lập kế hoạch dự án', deadline: '25/08/2026', status: 'Đã Làm' },
            {id: '9', title: 'Đánh giá hiệu suất', deadline: '30/08/2026', status: 'Hoàn Thành' },
            {id: '10',title: 'Tạo báo cáo tài chính', deadline: '02/09/2026', status: 'Chưa Làm' },
    ]);

    const updateTaskStatus = (id: string, status: TaskStatus) => {
        setTasks((prev) =>
            prev.map((task) => (task.id === id ? { ...task, status } : task))
        );
    };

    return (
        <TaskContext.Provider value={{ tasks, updateTaskStatus }}>
            {children}
        </TaskContext.Provider>
    );
}

export function useTasks() {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTasks phải được dùng bên trong TaskProvider');
    }
    return context;
}