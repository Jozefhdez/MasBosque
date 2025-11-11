export interface SOSInactiveViewProps {
  userName: string;
  userPhoto: string | null;
  isConnected: boolean;
  onProfilePress: () => void;
  onSOSPress: () => void;
}