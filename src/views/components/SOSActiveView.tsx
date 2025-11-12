import { StyleSheet, View, Text} from 'react-native';
import { SOSButtonDesign } from './Icon';
import { SOSActiveViewProps } from '../../models/SOSActiveViewProps';
import SlideToCancel from './SlideToCancel';

export default function SOSActiveView({isConnected, onSOSCancel} : SOSActiveViewProps) {
  
  return (
    <View style={styles.container}>

      <Text style={styles.sosTitle}>SOS</Text>

      <View style={styles.sosButton}>
        <SOSButtonDesign 
            size={200} 
            />
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          {isConnected ? 'Pidiendo ayuda' : 'Sin conexión'}
        </Text>
      </View>

      <SlideToCancel onSlideComplete={onSOSCancel || (() => {})} />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BB0003',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 120,
    paddingBottom: 40,
  },
  sosTitle: {
    fontFamily: 'IBMPlexSansDevanagari-Bold',
    fontSize: 96,
    color: '#FFFAFA',
    letterSpacing: 4,
    textAlign: 'center',
  },
  sosButton: {
    marginTop: -40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  statusText: {
    fontFamily: 'IBMPlexSansDevanagari-Medium',
    fontSize: 18,
    color: '#000',
  },
});
