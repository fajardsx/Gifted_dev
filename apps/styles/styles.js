import {moderateScale} from './scaling';

export default {
  container: {
    flex: 1,
  },
  centercontainer: {
    justifyContent: 'center',
  },
  profilsize: {
    width: moderateScale(100),
    height: moderateScale(100),
  },
  cellprofilsize: {
    width: moderateScale(35),
    height: moderateScale(35),
  },
};
