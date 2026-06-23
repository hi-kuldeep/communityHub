import { StyleSheet } from 'react-native';
import { spacing } from '@/theme/spacing';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1.5,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    width: '100%',
    height: 48,
    borderRadius: 8,
  },
});

export default styles;
