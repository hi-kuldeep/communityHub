import React from 'react';
import { View, StyleSheet } from 'react-native';
import CustomText from '@/components/CustomText';
import Avatar from '@/components/imageComponent/Avatar';
import { useThemeStore } from '@/store/useThemeStore';
import { getColors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

interface PostCardProps {
  item: IPost;
}

const PostCard: React.FC<PostCardProps> = React.memo(({ item }) => {
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
        borderColor: colors.border,
      },
      divider: {
        backgroundColor: colors.border,
      },
    };
  }, [colors.surface, colors.border]);

  return (
    <View style={[styles.card, dynamicStyles.card]}>
      {/* Header with author info */}
      <View style={styles.header}>
        <Avatar
          source={{ uri: item.author.avatar }}
          size={36}
          style={styles.avatar}
        />
        <View style={styles.authorInfo}>
          <CustomText preset="bodyMedium" color="text" style={styles.authorName}>
            {item.author.name}
          </CustomText>
          <CustomText preset="bodySmall" color="textLight">
            {dateStr}
          </CustomText>
        </View>
      </View>

      {/* Post content */}
      <CustomText preset="bodyLarge" color="text" style={styles.title}>
        {item.title}
      </CustomText>

      <CustomText preset="bodyMedium" color="textSecondary" style={styles.body}>
        {item.body}
      </CustomText>
    </View>
  );
});

export default PostCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.01,
    shadowRadius: 3,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  avatar: {
    marginRight: spacing.sm,
  },
  authorInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  authorName: {
    fontWeight: '600',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  body: {
    lineHeight: 20,
  },
});
