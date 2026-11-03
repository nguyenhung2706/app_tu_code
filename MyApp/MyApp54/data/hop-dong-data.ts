export type ContractStatus = 'Chờ ký' | 'Đã ký' | 'Sắp hết hạn' | 'Hết hạn';

export const contracts = [
    {
        id: 'HD-001',
        employeeName: 'Nguyễn Văn A',
        type: 'Hợp Đồng lao động',
        startDate: '2023-01-01',
        endDate: '2024-01-01',
        signDate: '2023-01-01',
        status: 'Chờ ký' as ContractStatus,
    },
    {
        id: 'HD-002',
        employeeName: 'Trần Thị B',
        type: 'Hợp Đồng lao động',
        startDate: '2023-01-01',
        endDate: '2024-01-01',
        signDate: '2023-01-01',
        status: 'Đã ký' as ContractStatus,
    },
    {
        id: 'HD-003',
        employeeName: 'Lê Văn C',
        type: 'Hợp Đồng lao động',
        startDate: '2023-01-01',
        endDate: '2024-01-01',
        signDate: '2023-08-15',
        status: 'Sắp hết hạn' as ContractStatus,
    },
    {
        id: 'HD-004',
        employeeName: 'Phạm Thị D',
        type: 'Hợp Đồng lao động',
        startDate: '2023-01-01',
        endDate: '2024-01-01',
        signDate: '2021-07-12',
        status: 'Hết hạn' as ContractStatus,
    },
];