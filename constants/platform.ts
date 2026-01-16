import { Platform, Dimensions } from 'react-native';

export const isWeb = Platform.OS === 'web';
export const isMobile = Platform.OS === 'ios' || Platform.OS === 'android';

export const getIsLargeScreen = () => {
  const { width } = Dimensions.get('window');
  return width >= 1024;
};

export const useResponsive = () => {
  const { width } = Dimensions.get('window');
  return {
    isWeb,
    isMobile,
    isLargeScreen: width >= 1024,
    isTablet: width >= 768 && width < 1024,
    isPhone: width < 768,
  };
};
