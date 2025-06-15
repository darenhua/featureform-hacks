import { useFonts as useExpoFonts } from 'expo-font';

export default function useFonts() {
  const [fontsLoaded] = useExpoFonts({
    // Helvetica Now Display fonts
    'HelveticaNow-Thin': require('../assets/fonts/HelveticaNowDisplay-Thin.ttf'),
    'HelveticaNow-Light': require('../assets/fonts/HelveticaNowDisplay-Light.ttf'),
    'HelveticaNow-Regular': require('../assets/fonts/HelveticaNowDisplay-Regular.ttf'),
    'HelveticaNow-Medium': require('../assets/fonts/HelveticaNowDisplay-Medium.ttf'),
    'HelveticaNow-Bold': require('../assets/fonts/HelveticaNowDisplay-Bold.ttf'),
    'HelveticaNow-ExtraBold': require('../assets/fonts/HelveticaNowDisplay-ExtraBold.ttf'),
    'HelveticaNow-Black': require('../assets/fonts/HelveticaNowDisplay-Black.ttf'),
    // Space Mono for monospace text
    'SpaceMono-Regular': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  return fontsLoaded;
} 