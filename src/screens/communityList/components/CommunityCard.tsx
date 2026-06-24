import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Users, ChevronRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import CustomText from '@/components/CustomText';
import { useThemeStore } from '@/store/useThemeStore';
import { getColors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

interface CommunityCardProps {
  item: ICommunity;
  onPress: (id: string) => void;
}

const CommunityCard: React.FC<CommunityCardProps> = React.memo(({ item, onPress }) => {
  const { t } = useTranslation();
  const { themeMode } = useThemeStore();
  const colors = getColors(themeMode);
  const isDarkMode = themeMode === 'dark';

  const handlePress = () => {
    onPress(item.id);
  };

  // Format statistics
  const formattedMembers = item.memberCount.toLocaleString();
  const formattedPosts = item.postCount.toLocaleString();

  const dynamicStyles = React.useMemo(() => {
    return {
      card: {
        backgroundColor: colors.surface,
        borderColor: colors.border,
      },
      joinedBadge: {
        backgroundColor: isDarkMode ? 'rgba(52, 168, 83, 0.15)' : 'rgba(52, 168, 83, 0.1)',
        borderColor: isDarkMode ? 'rgba(52, 168, 83, 0.3)' : 'rgba(52, 168, 83, 0.2)',
      },
      cardFooter: {
        borderTopColor: colors.border,
      },
    };
  }, [colors.surface, colors.border, isDarkMode]);

  return (
    <TouchableOpacity
      style={[styles.card, dynamicStyles.card]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.nameContainer}>
          <CustomText preset="bodyLarge" color="text" style={styles.nameText}>
            {item.name}
          </CustomText>
        </View>

        {item.joined && (
          <View style={[styles.joinedBadge, dynamicStyles.joinedBadge]}>
            <CustomText preset="bodySmall" color="primary" style={styles.joinedText}>
              Joined
            </CustomText>
          </View>
        )}
      </View>

      <CustomText preset="bodyMedium" color="textSecondary" numberOfLines={2} style={styles.description}>
        {item.description}
      </CustomText>

      <View style={[styles.cardFooter, dynamicStyles.cardFooter]}>
        <View style={styles.statsContainer}>
          <Users size={16} color={colors.textLight} style={styles.footerIcon} />
          <CustomText preset="bodySmall" color="textSecondary">
            {formattedMembers} {t('communityDetails.members')}  •  {formattedPosts} {t('communityDetails.posts')}
          </CustomText>
        </View>

        <ChevronRight size={18} color={colors.textLight} />
      </View>
    </TouchableOpacity>
  );
});

export default CommunityCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  nameContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  nameText: {
    fontWeight: 'bold',
  },
  joinedBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
  },
  joinedText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#34A853',
  },
  description: {
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerIcon: {
    marginRight: spacing.xs,
  },
});
