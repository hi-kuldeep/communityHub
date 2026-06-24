import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '@/store/useThemeStore';
import { getColors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText }) => {
  const { t } = useTranslation();
  const { themeMode } = useThemeStore();
  const colors = getColors(themeMode);

  const handleClear = () => {
    onChangeText('');
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <Search size={18} color={colors.textLight} style={styles.searchIcon} />
      <TextInput
        style={[styles.input, { color: colors.text }]}
        placeholder={t('communityList.searchPlaceholder')}
        placeholderTextColor={colors.textLight}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="never" // Custom clear button handles both iOS and Android consistently
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={handleClear}
          activeOpacity={0.7}
          style={styles.clearButton}
        >
          <X size={16} color={colors.textLight} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.md,
  },
  searchIcon: {
    marginRight: spacing.xs,
  },
  input: {
    flex: 1,
    fontSize: 14,
    height: '100%',
    paddingVertical: 0, // Prevents Android vertical shifts
  },
  clearButton: {
    padding: spacing.xs,
  },
});
