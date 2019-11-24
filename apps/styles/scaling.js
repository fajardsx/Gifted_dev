import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

//guideline sizes are based on standart ~5 screen mobile devices
const guidelinebasewidth = 375;
const guidelinebaseheight = 667;

const scale = size => (width / guidelinebasewidth) * size;
const verticalScale = size => (height / guidelinebaseheight) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

export { scale, verticalScale, moderateScale };
