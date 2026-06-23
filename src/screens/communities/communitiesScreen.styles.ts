import { StyleSheet } from 'react-native';
import { spacing } from '@/theme/spacing';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  title: {
    marginTop: spacing.md,
  },
  subtitle: {
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  mockList: {
    width: '100%',
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  mockItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1.5,
  },
});

export default styles;
