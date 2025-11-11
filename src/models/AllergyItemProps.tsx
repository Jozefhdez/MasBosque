export interface AllergyItemProps {
  allergy: string;
  onRemove: () => void;
  onChangeText: (text: string) => void;
  onClear: () => void;
}