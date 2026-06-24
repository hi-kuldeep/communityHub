import React from 'react';
import { ScrollView, TouchableOpacity, StyleSheet, View } from 'react-native';
import CustomText from '@/components/CustomText';
import { useThemeStore } from '@/store/useThemeStore';
import { getColors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

interface SortFilterProps {
  selected: SORT_OPTIONS;
  onSelect: (option: SORT_OPTIONS) => void;
}

interface SortItem {
  value: SORT_OPTIONS;
  label: string;
}

const SORT_ITEMS: SortItem[] = [
  { value: 'name_asc', label: 'Name A-Z' },
  { value: 'name_desc', label: 'Name Z-A' },
  { value: 'members_desc', label: 'Most Popular' },
];

const SortFilter: React.FC<SortFilterProps> = ({ selected, onSelect }) => {
  const { themeMode } = useThemeStore();
  const colors = getColors(themeMode);

  return (
    <View style={styles.outerContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {SORT_ITEMS.map(item => {
          const isActive = selected === item.value;
          const dynamicChipStyle = {
            backgroundColor: isActive ? colors.primary : colors.surface,
            borderColor: isActive ? colors.primary : colors.border,
          };
          const dynamicTextStyle = {
            fontWeight: (isActive ? '600' : '400') as '600' | '400',
            color: isActive ? '#FFFFFF' : colors.textSecondary,
          };

          return (
            <TouchableOpacity
              key={item.value}
              style={[styles.chip, dynamicChipStyle]}
              onPress={() => onSelect(item.value)}
              activeOpacity={0.8}
            >
              <CustomText
                preset="bodySmall"
                color={isActive ? 'background' : 'textSecondary'}
                style={[styles.chipText, dynamicTextStyle]}
              >
                {item.label}
              </CustomText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default SortFilter;

const styles = StyleSheet.create({
  outerContainer: {
    marginBottom: spacing.md,
  },
  scrollContainer: {
    gap: spacing.sm,
    paddingVertical: 2, // avoid shadow cuts
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  chipText: {
    fontSize: 12,
  },
});
