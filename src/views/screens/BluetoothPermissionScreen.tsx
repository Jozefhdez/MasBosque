import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useBluetoothPermissionController } from '../../controllers/BluetoothPermissionController';
import { BluetoothIcon } from '../components/Icon';

export default function BluetoothPermissionScreen() {
    const { handleOpenSettings } = useBluetoothPermissionController();

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <BluetoothIcon
                    size={100}
                    color='#000ea7ff'
                />
                <Text style={styles.title}>Permiso de Bluetooth requerido</Text>
                <Text style={styles.description}>
                    MasBosque necesita acceso a Bluetooth para comunicarse con la red de MasBosque y proporcionar servicios de emergencia.
                </Text>

                <TouchableOpacity style={styles.primaryButton} onPress={handleOpenSettings}>
                    <Text style={styles.primaryButtonText}>Abrir Ajustes</Text>
                </TouchableOpacity>

                <Text style={styles.note}>
                    Puedes cambiar el permiso cuando quieras en ajustes.
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFAFA',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    content: {
        maxWidth: 400,
        alignItems: 'center',
    },
    icon: {
        fontSize: 80,
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontFamily: 'IBMPlexSansDevanagari-Bold',
        color: '#003706',
        textAlign: 'center',
        marginBottom: 16,
        marginTop: 64
    },
    description: {
        fontSize: 16,
        fontFamily: 'IBMPlexSansDevanagari-Regular',
        color: '#666666',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
    },
    primaryButton: {
        backgroundColor: '#003706',
        paddingVertical: 18,
        paddingHorizontal: 32,
        borderRadius: 32,
        width: '100%',
        marginBottom: 32,
    },
    primaryButtonText: {
        color: '#FFFAFA',
        fontSize: 16,
        fontFamily: 'IBMPlexSansDevanagari-SemiBold',
        textAlign: 'center',
    },
    note: {
        fontSize: 12,
        fontFamily: 'IBMPlexSansDevanagari-Regular',
        color: '#999999',
        textAlign: 'center',
        lineHeight: 18,
    },
});
