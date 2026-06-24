import React from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import CustomText from '@/components/CustomText';
import Avatar from '@/components/imageComponent/Avatar';
import { useThemeStore } from '@/store/useThemeStore';
import { getColors } from '@/theme/colors';
import styles from './PostCard.style';

interface PostCardProps {
  item: IPost & { isPending?: boolean; isFailed?: boolean };
  onPressRetry?: (item: any) => void;
}

const PostCard: React.FC<PostCardProps> = React.memo(
  ({ item, onPressRetry }) => {
    const { t } = useTranslation();
    const { themeMode } = useThemeStore();
    const colors = getColors(themeMode);

    // Format date representation
    const dateStr = React.useMemo(() => {
      try {
        const date = new Date(item.createdAt);
        return date.toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      } catch {
        return '';
      }
    }, [item.createdAt]);

    const dynamicStyles = React.useMemo(() => {
      return {
        card: {
          backgroundColor: colors.surface,
          borderColor: item.isFailed ? colors.error : colors.border,
          opacity: item.isPending ? 0.6 : 1,
        },
        divider: {
          backgroundColor: colors.border,
        },
      };
    }, [
      colors.surface,
      colors.border,
      item.isPending,
      item.isFailed,
      colors.error,
    ]);

    const handlePressCard = () => {
      if (item.isFailed && onPressRetry) {
        onPressRetry(item);
      }
    };

    return (
      <TouchableOpacity
        activeOpacity={item.isFailed ? 0.7 : 1}
        onPress={handlePressCard}
        style={[styles.card, dynamicStyles.card]}
      >
        {/* Header with author info */}
        <View style={styles.header}>
          <Avatar
            source={{ uri: item.author.avatar }}
            size={36}
            style={styles.avatar}
          />
          <View style={styles.authorInfo}>
            <View style={styles.authorRow}>
              <CustomText
                preset="bodyMedium"
                color="text"
                style={styles.authorName}
              >
                {item.author.name}
              </CustomText>
              {item.isPending && (
                <CustomText
                  preset="bodySmall"
                  color="primary"
                  style={styles.sendingText}
                >
                  ({t('createPost.submitting')})
                </CustomText>
              )}
            </View>
            <CustomText preset="bodySmall" color="textLight">
              {dateStr}
            </CustomText>
          </View>
        </View>

        {/* Post content */}
        <CustomText preset="bodyLarge" color="text" style={styles.title}>
          {item.title}
        </CustomText>

        <CustomText
          preset="bodyMedium"
          color="textSecondary"
          style={styles.body}
          numberOfLines={3}
          isLoadMoreEnable
        >
          {item.body}
        </CustomText>

        {/* Failed to send overlay warning */}
        {item.isFailed && (
          <View
            style={[styles.errorContainer, { borderTopColor: colors.border }]}
          >
            <CustomText
              preset="bodySmall"
              color="error"
              style={styles.errorText}
            >
              {t('createPost.failedMessage')}
            </CustomText>
          </View>
        )}

        {/* Loader indicator for pending state */}
        {item.isPending && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        )}
      </TouchableOpacity>
    );
  },
);

export default PostCard;

