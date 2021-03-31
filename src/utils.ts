

// See https://mydevice.io/devices/ for device dimensions
import {Dimensions, Platform} from "react-native";

const X_WIDTH = 375;
const X_HEIGHT = 812;
const XSMAX_WIDTH = 414;
const XSMAX_HEIGHT = 896;
const PAD_WIDTH = 768;
const PAD_HEIGHT = 1024;
const IPHONE12_WIDTH = 390;
const IPHONE12_HEIGHT = 844;
const IPHONE12MAX_WIDTH = 428;
const IPHONE12MAX_HEIGHT = 926;
const IPHONE12MINI_WIDTH = 360;
const IPHONE12MINI_HEIGHT = 780;

const {width: D_WIDTH, height: D_HEIGHT} = Dimensions.get('window');

const isIPhoneX = (() => {
    if (Platform.OS === 'web') return false;

    return (
        Platform.OS === 'ios' &&
        ((D_HEIGHT === X_HEIGHT && D_WIDTH === X_WIDTH) ||
            (D_HEIGHT === X_WIDTH && D_WIDTH === X_HEIGHT)) ||
        ((D_HEIGHT === XSMAX_HEIGHT && D_WIDTH === XSMAX_WIDTH) ||
            (D_HEIGHT === XSMAX_WIDTH && D_WIDTH === XSMAX_HEIGHT)) ||
        ((D_HEIGHT === IPHONE12_HEIGHT && D_WIDTH === IPHONE12_WIDTH) ||
            (D_HEIGHT === IPHONE12_WIDTH && D_WIDTH === IPHONE12_HEIGHT)) ||
        ((D_HEIGHT === IPHONE12MAX_HEIGHT && D_WIDTH === IPHONE12MAX_WIDTH) ||
            (D_HEIGHT === IPHONE12MAX_WIDTH && D_WIDTH === IPHONE12MAX_HEIGHT)) ||
        ((D_HEIGHT === IPHONE12MINI_HEIGHT && D_WIDTH === IPHONE12MINI_WIDTH) ||
            (D_HEIGHT === IPHONE12MINI_WIDTH && D_WIDTH === IPHONE12MINI_HEIGHT))
    );
})();

export {
    isIPhoneX
};
