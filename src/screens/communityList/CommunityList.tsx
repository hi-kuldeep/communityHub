import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useTranslation } from 'react-i18next';
import Container from '@/components/container/Container';
import CustomButton from '@/components/CustomButton';
import LoadingSpinner from '@/components/placeholder/LoadingSpinner';
import Error from '@/components/placeholder/Error';
import Empty from '@/components/placeholder/Empty';
import RefreshControlComponent from '@/components/refreshControlComponent/RefreshControlComponent';
import { useThemeStore } from '@/store/useThemeStore';
import { getColors } from '@/theme/colors';
import useCommunityList from './useCommunityList';
import styles from './CommunityList.style';
import SearchBar from './components/SearchBar';
import SortFilter from './components/SortFilter';
import CommunityCard from './components/CommunityCard';

const CommunityList = () => {
  const { t } = useTranslation();
  const { themeMode } = useThemeStore();
  const colors = getColors(themeMode);

  const {
    communities,
    search,
    setSearch,
    sort,
    onSelectSort,
    refreshing,
    onRefresh,
    onEndReached,
    onPressCommunity,
    isInitialLoading,
    isError,
    isEmpty,
    isFetchingNextPage,
    refetch,
  } = useCommunityList();

  const renderItem = React.useCallback(
    ({ item }: { item: any }) => (
      <CommunityCard item={item} onPress={onPressCommunity} />
    ),
    [onPressCommunity],
  );

  const renderFooter = React.useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }, [isFetchingNextPage, colors.primary]);

  const renderContent = () => {
    if (isInitialLoading) {
      return (
        <View style={styles.loadingContainer}>
          <LoadingSpinner textDisable={false} />
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.loadingContainer}>
          <Error text={t('common.error')}>
            <CustomButton
              mode="filled"
              onPress={() => refetch()}
              style={styles.retryButton}
            >
              {t('common.retry')}
            </CustomButton>
          </Error>
        </View>
      );
    }

    if (isEmpty) {
      return (
        <View style={styles.loadingContainer}>
          <Empty
            text={
              search
                ? t('communityList.noCommunitiesFound')
                : t('common.noDataFound')
            }
          />
        </View>
      );
    }

    return (
      <FlashList
        data={communities}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        extraData={sort}
        maintainVisibleContentPosition={{ disabled: true }} // To allow clean rendering of sorted data without viewport anchoring shifts.
        onEndReached={onEndReached}
        onEndReachedThreshold={0.4}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={renderFooter}
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
      <View style={styles.content}>
        <SearchBar value={search} onChangeText={setSearch} />
        <SortFilter selected={sort} onSelect={onSelectSort} />
        {renderContent()}
      </View>
    </Container>
  );
};

export default CommunityList;
