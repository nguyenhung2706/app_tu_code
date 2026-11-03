import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useLeaveRequests } from '@/context/leave-repuest-context';
import { useTheme } from '@/context/theme-context';
import FormDoiCa from '@/components/forms/FormDoiCa';
import FormLamThem from '@/components/forms/FormLamThem';


export default function TaoDon() {
    const router = useRouter();
    const { colors } = useTheme();
    const { addRequest } = useLeaveRequests();

    const [type, setType] = useState('Xin nghỉ phép');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    
    const handleSubmit = () => {
        if (!startDate || !endDate || !reason) {
            Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
            return;
        }
        addRequest({ type, startDate, endDate, reason });
        router.push('/staff/don-tu');
        // xóa trắng khi gửi thành công 
        setStartDate('');
        setEndDate('');
        setReason('');
    }
    return (
        <View style={[styles.container, { backgroundColor: colors.bg }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push('/staff/don-tu')}>
                    <Text style={[styles.backButton, { color: colors.text }]}>←</Text>
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Tạo đơn</Text>
                <Text style={[styles.menuIcon, { color: colors.text }]}>⋮</Text>
            </View>

            <Text style={[styles.label, { color: colors.sub }]}>Loại đơn</Text>
            <View style={[styles.selectBox, { backgroundColor: colors.card }]}>
                <Text style={[styles.selectText, { color: colors.text }]}>{type}</Text>
                <Text style={[styles.selectArrow, { color: colors.sub }]}>▼</Text>
            </View>

            <Text style={[styles.label, { color: colors.sub }]}>Ngày bắt đầu</Text>
            <TextInput 
                style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
                placeholder="dd/mm/yyyy"
                placeholderTextColor={colors.sub}
                value={startDate}
                onChangeText={setStartDate}
            />

            <Text style={[styles.label, { color: colors.sub }]}>Ngày kết thúc</Text>
            <TextInput
                style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
                placeholder="dd/mm/yyyy"
                placeholderTextColor={colors.sub}
                value={endDate}
                onChangeText={setEndDate}
            />

            <Text style={[styles.label, { color: colors.sub }]}>Lý do</Text>
            <TextInput
                style={[styles.input, styles.textArea, { backgroundColor: colors.card, color: colors.text }]}
                placeholder="Nhập lý do..."
                placeholderTextColor={colors.sub}
                value={reason}
                onChangeText={setReason}
                multiline
                numberOfLines={4}
            />

            <TouchableOpacity
                style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitText}>Gửi đơn</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 20,
        paddingTop: 15,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButton: { fontSize: 22 },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    menuIcon: { fontSize: 20 },
    label: { 
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
        marginTop: 10,
    },
    selectBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 12,
    },
    selectText: { fontSize: 15},
    selectArrow: { fontSize: 14, color: '#888' },
    input: {
        backgroundColor: '#fff',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 12,
        fontSize: 15,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: '#007BFF',
        borderRadius: 5,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    submitText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});
