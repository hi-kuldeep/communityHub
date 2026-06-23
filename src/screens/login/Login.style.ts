import { StyleSheet, Platform } from 'react-native';
import { spacing } from '@/theme/spacing';

const loginStyle = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
    zIndex: 2,
  },
  // Mesh Gradient Blobs
  blob1: {
    position: 'absolute',
    top: -50,
    left: -50,
    width: 250,
    height: 250,
    borderRadius: 125,
    opacity: 0.15,
  },
  blob2: {
    position: 'absolute',
    bottom: -80,
    right: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.12,
  },
  blob3: {
    position: 'absolute',
    top: '40%',
    left: '30%',
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0.08,
  },
  themeToggleContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 44 : 20,
    right: 20,
    zIndex: 10,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
    zIndex: 2,
  },
  logoIconBg: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: spacing.xs,
    letterSpacing: -0.5,
  },
  appSubtitle: {
    textAlign: 'center',
    paddingHorizontal: spacing.md,
    lineHeight: 20,
  },
  // Glassmorphic Authentication Card
  authCard: {
    borderRadius: 24,
    borderWidth: 1.5,
    padding: spacing.xl,
    width: '100%',
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  input: {
    marginBottom: spacing.md,
  },
  // Remember Me / Forgot Password
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  checkboxLabel: {
    fontSize: 13,
  },
  forgotPasswordLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  // Button & Glow
  button: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  // Divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: spacing.md,
    fontSize: 12,
    fontWeight: '500',
  },
  // Social Login Icons
  socialRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  socialButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  socialButtonText: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  // Bottom Link
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
    zIndex: 2,
  },
  footerText: {
    fontSize: 13,
  },
  footerLink: {
    fontSize: 13,
    fontWeight: '600',
  },
});

export default loginStyle;
