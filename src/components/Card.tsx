import React from 'react';
import { StyleSheet, View, ViewProps, ViewStyle } from 'react-native';
import colors from '../theme/colors';
import spacing from '../theme/spacing';

interface CardProps extends ViewProps {
  glow?: boolean;
  highlightColor?: string;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  glow = false,
  highlightColor,
  style,
  children,
  ...props
}) => {
  return (
    <View
      style={[
        styles.card,
        highlightColor ? { borderColor: highlightColor } : null,
        glow
          ? {
              shadowColor: highlightColor || colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 10,
              elevation: 5,
            }
          : null,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceCard,
    borderRadius: spacing.cardRadius,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    padding: 16,
  },
});

export default Card;
