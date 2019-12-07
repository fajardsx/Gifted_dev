import {moderateScale} from './scaling';
import {convertHeight, convertWidth} from '../configs/utils';

export default {
  container: {
    flex: 1,
  },
  containerDimension: {
    width: convertWidth(100),
    height: convertHeight(100),
  },
  centercontainer: {
    justifyContent: 'center',
  },
  headerstyle: {
    flexDirection: 'row',
    alignItems: 'center',
    height: moderateScale(65),
    width: convertWidth(100),
  },
  profilsize: {
    width: moderateScale(100),
    height: moderateScale(100),
  },
  cellprofilsize: {
    width: moderateScale(35),
    height: moderateScale(35),
  },
  cellPhotosize: {
    width: moderateScale(45),
    height: moderateScale(45),
  },
  logoPhotosize: {
    width: moderateScale(50),
    height: moderateScale(50),
  },
  tabicon: {width: moderateScale(25), height: moderateScale(25)},
};
