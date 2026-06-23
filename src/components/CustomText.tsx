import React, { ReactNode, useCallback, useState } from 'react';
import {
  ColorValue,
  GestureResponderEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
  View,
} from 'react-native';

import { FONTS } from '@/theme/fonts';
import { COLORS, ThemeColor } from '@/theme/colors';
import { theme, TypographyPreset } from '@/theme';
import { spacingStyle } from '@/types/styleType';
import { capitalizeString, fontSizePixelRatio } from '@/utils/developmentFunctions';

export type TypographySize = keyof typeof theme.typography.sizes;

interface TCustomText extends spacingStyle {
  preset?: TypographyPreset;
  color?: ThemeColor;
  colorCode?: ColorValue;
  fontSize?: number | TypographySize;
  fontFamily?: keyof typeof FONTS;
  letterSpacing?: number;
  style?: StyleProp<TextStyle>;
  onPress?: (event: GestureResponderEvent) => void;
  isLoadMoreEnable?: boolean;
  restProps?: TextProps;
  numberOfLines?: number;
  children: ReactNode;
  textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify' | undefined;
  flex?: number;
  disabled?: boolean;
  isCapitalizeFirstLetter?: boolean;
  loadMoreStyle?: StyleProp<TextStyle>;
}

export default function CustomText({
  preset,
  color = 'black',
  fontFamily,
  style,
  onPress,
  isLoadMoreEnable,
  restProps,
  numberOfLines,
  children,
  textAlign,
  fontSize,
  flex,
  disabled,
  colorCode,
  isCapitalizeFirstLetter,
  loadMoreStyle,
  ...props
}: TCustomText) {
  const [loadMore, setLoadMore] = useState(false);
  const [numOfLines, setNumOfLines] = useState(0);
  const onTextLayout = useCallback(
    (e: NativeSyntheticEvent<any>) => {
      if (numOfLines === 0) setNumOfLines(e.nativeEvent.lines.length);
    },
    [numOfLines],
  );

  const onLoadMoreToggle = () => {
    setLoadMore(!loadMore);
  };
  const handleNumberOfLines = () => {
    if (isLoadMoreEnable) {
      if (numOfLines === 0) {
        return undefined;
      }
      if (loadMore) {
        return numOfLines;
      }
      return numberOfLines;
    }
    return numberOfLines;
  };

  const resolvedPreset = preset ? theme.typography.presets[preset] : undefined;
  const resolvedColor = colorCode ?? COLORS[color]; // Use customColor if provided, otherwise use COLORS key
  // Flatten the style array (if it's an array) or use the single style object
  const flattenedStyle = StyleSheet.flatten(style);
  // Resolve fontSize: use flattenedStyle.fontSize if it exists, otherwise use custom prop, preset, or default to 14
  let resolvedPropFontSize: number | undefined = undefined;
  if (typeof fontSize === 'number') {
    resolvedPropFontSize = fontSize;
  } else if (typeof fontSize === 'string' && fontSize in theme.typography.sizes) {
    resolvedPropFontSize = theme.typography.sizes[fontSize];
  }

  const baseFontSize = resolvedPropFontSize ?? resolvedPreset?.fontSize ?? 14;
  const resolvedFontSize = flattenedStyle?.fontSize
    ? fontSizePixelRatio(flattenedStyle.fontSize) // Apply fontSizePixelRatio to style's fontSize
    : fontSizePixelRatio(baseFontSize); // Apply fontSizePixelRatio to resolved base fontSize
  return (
    <>
      <Text
        suppressHighlighting
        onPress={onPress}
        disabled={disabled}
        onTextLayout={onTextLayout}
        style={[
          {
            color: resolvedColor,
            textAlign: textAlign ?? 'left',
            flex,
            fontFamily: resolvedPreset?.fontFamily ?? (fontFamily ? FONTS?.[fontFamily] : FONTS.regular),
            fontSize: resolvedFontSize,
          },
          resolvedPreset && {
            lineHeight: fontSizePixelRatio(resolvedPreset.lineHeight),
            fontWeight: resolvedPreset.fontWeight as any,
          },
          style,
          props,
          // Re-apply overrides if passed explicitly
          fontFamily ? { fontFamily: FONTS?.[fontFamily] } : undefined,
          resolvedPropFontSize !== undefined ? { fontSize: fontSizePixelRatio(resolvedPropFontSize) } : undefined,
        ]}
        numberOfLines={handleNumberOfLines()}
        {...restProps}
      >
        {children && isCapitalizeFirstLetter && typeof children === 'string'
          ? capitalizeString(children)
          : children}
      </Text>

      {isLoadMoreEnable
        ? numOfLines > (numberOfLines ?? 0) && (
            <View>
              <Pressable onPress={onLoadMoreToggle}>
                <Text
                  style={[
                    {
                      fontSize: fontSizePixelRatio(12),
                      color: COLORS.black,
                      fontFamily: FONTS.regular,
                    },
                    loadMoreStyle,
                  ]}
                >
                  {loadMore ? 'Load Less' : 'Load More'}
                </Text>
              </Pressable>
            </View>
          )
        : null}
    </>
  );
}
