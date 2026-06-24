import React from 'react';
import { View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import Container from '@/components/container/Container';
import CustomText from '@/components/CustomText';
import CustomButton from '@/components/CustomButton';
import LoadingSpinner from '@/components/placeholder/LoadingSpinner';
import ErrorComponent from '@/components/placeholder/Error';
import EmptyComponent from '@/components/placeholder/Empty';
import RefreshControlComponent from '@/components/refreshControlComponent/RefreshControlComponent';

import { useThemeStore } from '@/store/useThemeStore';
import { getColors } from '@/theme/colors';
import { rootStackName } from '@/navigation/rootStackNavigator/rootStackName';
import { rootStackParams } from '@/navigation/rootStackNavigator/rootStackParams';
import useCommunityDetails from './useCommunityDetails';
import PostCard from './components/PostCard';
import styles from './CommunityDetails.style';
import { showModal } from '@/components/modalProvider/ModalProvider';

const CommunityDetails = () => {
  const { t } = useTranslation();
  const { themeMode } = useThemeStore();
  const colors = getColors(themeMode);
  const navigation =
    useNavigation<NativeStackNavigationProp<rootStackParams>>();

  const {
    community,
    communityId,
    posts,
    isDetailsLoading,
    isDetailsError,
    isPostsLoading,
    isPostsError,
    isTogglingJoin,
    refreshing,
    onRefresh,
    handleToggleJoin,
    handleGoBack,
    handleRetryPost,
    refetchDetails,
    refetchPosts,
  } = useCommunityDetails();

  const handleNavigateToCreatePost = React.useCallback(() => {
    if (!community?.joined) {
      return showModal({
        message: t('communityDetails.notMember'),
        successTitle: t('common.ok'),
      });
    }
    navigation.navigate(rootStackName.CREATE_POST, { communityId });
  }, [navigation, communityId, community?.joined]);

  const renderPostItem = React.useCallback(
    ({ item }: { item: IPost }) => (
      <PostCard item={item} onPressRetry={handleRetryPost} />
    ),
    [handleRetryPost],
  );

  const renderHeaderComponent = () => {
    if (!community) return null;

    const formattedMembers = community.memberCount.toLocaleString();
    const formattedPosts = community.postCount.toLocaleString();

    return (
      <View>
        {/* Main Details Panel */}
        <View
          style={[
            styles.detailsContainer,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <CustomText
            preset="heading3"
            color="text"
            style={styles.communityName}
          >
            {community.name}
          </CustomText>
          <CustomText
            preset="bodySmall"
            color="textSecondary"
            style={styles.description}
          >
            {community.description}
          </CustomText>

          {/* Dynamic Community Statistics */}
          <View style={[styles.statsContainer, { borderColor: colors.border }]}>
            <View style={styles.statBox}>
              <CustomText
                preset="bodyLarge"
                color="text"
                style={styles.statValue}
              >
                {formattedMembers}
              </CustomText>
              <CustomText
                preset="bodySmall"
                color="textLight"
                isCapitalizeFirstLetter
              >
                {t('communityDetails.members')}
              </CustomText>
            </View>
            <View style={styles.statBox}>
              <CustomText
                preset="bodyLarge"
                color="text"
                style={styles.statValue}
              >
                {formattedPosts}
              </CustomText>
              <CustomText
                preset="bodySmall"
                color="textLight"
                isCapitalizeFirstLetter
              >
                {t('communityDetails.posts')}
              </CustomText>
            </View>
          </View>

          {/* Join / Leave Dynamic Button */}
          <CustomButton
            mode={community.joined ? 'outlined' : 'filled'}
            loading={isTogglingJoin}
            onPress={handleToggleJoin}
            style={styles.joinButton}
          >
            {community.joined
              ? t('communityDetails.leave')
              : t('communityDetails.join')}
          </CustomButton>
        </View>

        {/* Posts Section Title */}
        <View style={styles.sectionHeader}>
          <CustomText
            preset="heading3"
            color="text"
            style={styles.sectionTitle}
          >
            {t('communityDetails.postsSectionTitle')}
          </CustomText>
        </View>

        {/* Independent Posts Error State */}
        {isPostsError && (
          <View style={styles.postsErrorContainer}>
            <ErrorComponent text={t('communityDetails.postsLoadError')}>
              <CustomButton
                mode="outlined"
                onPress={() => refetchPosts()}
                style={styles.retryButton}
              >
                {t('common.retry')}
              </CustomButton>
            </ErrorComponent>
          </View>
        )}

        {/* Independent Posts Loading State */}
        {isPostsLoading && !isPostsError && (
          <View style={styles.postsLoadingContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        )}

        {/* Empty Posts State */}
        {!isPostsLoading && !isPostsError && posts.length === 0 && (
          <EmptyComponent text={t('communityDetails.noPosts')} />
        )}
      </View>
    );
  };

  const renderContent = () => {
    // 1. Initial Details Loading State
    if (isDetailsLoading) {
      return (
        <View style={styles.loadingContainer}>
          <LoadingSpinner textDisable={false} />
        </View>
      );
    }

    // 2. Details Loading Failed
    if (isDetailsError || !community) {
      return (
        <View style={styles.loadingContainer}>
          <ErrorComponent text={t('communityDetails.loadError')}>
            <CustomButton
              mode="filled"
              onPress={() => refetchDetails()}
              style={styles.retryButton}
            >
              {t('common.retry')}
            </CustomButton>
          </ErrorComponent>
        </View>
      );
    }

    // 3. Main Content Render (Scrollable posts list with details header)
    return (
      <FlashList
        data={isPostsError ? [] : posts}
        renderItem={renderPostItem}
        keyExtractor={item => item.id}
        maintainVisibleContentPosition={{ disabled: true }} // Avoid shifts when updating data
        ListHeaderComponent={renderHeaderComponent}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControlComponent
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
    );
  };

  return (
    <Container
      isScrollable={false}
      isSaferAreaView={true}
      containerStyle={styles.container}
    >
      {renderContent()}

      {/* Floating Action Button – Create Post */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={handleNavigateToCreatePost}
        activeOpacity={0.85}
        accessibilityLabel={t('createPost.fabLabel')}
        accessibilityRole="button"
      >
        <Plus size={28} color="#ffffff" strokeWidth={2.5} />
      </TouchableOpacity>
    </Container>
  );
};

export default CommunityDetails;
