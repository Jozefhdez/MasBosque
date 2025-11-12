import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { MinusCircle, XIcon } from './Icon';
import { AllergyItemProps } from '../../models/AllergyItemProps';

export default function AllergyItem({ allergy, onRemove, onChangeText, onClear }: AllergyItemProps) {
  return (
    <View style={styles.allergyItem}>
      <TouchableOpacity 
        onPress={onRemove}
        style={styles.removeButton}
      >
        <MinusCircle
          size={24}
          color='#003706'
        />
      </TouchableOpacity>

      <View style={styles.inputWrapper}>
        <TextInput
            style={styles.input}
            placeholder=". . ."
            value={allergy}
            onChangeText={onChangeText}
            keyboardType="default"
            autoCapitalize="words"
            placeholderTextColor="#999"
        />
        {allergy.length > 0 && (
            <TouchableOpacity 
                style={styles.iconButton}
                onPress={onClear}
            >
                <XIcon
                size={20}
                color='black'
                />
            </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  allergyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  removeButton: {
    marginRight: 12,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F0EF',
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    fontFamily: 'IBMPlexSansDevanagari-Regular',
  },
  iconButton: {
    padding: 8,
  },
});
