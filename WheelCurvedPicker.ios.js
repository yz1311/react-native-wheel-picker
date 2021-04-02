'use strict';

import React from 'react';
import {
	View,
	NativeModules
} from 'react-native';
import PickerIOS from "./src/PickerIOS";

let PickerIOSComponent = null;
if("RNWPicker" in NativeModules.UIManager) {
	PickerIOSComponent = PickerIOS;
} else {
	PickerIOSComponent = require('react-native').PickerIOS;
}

module.exports = PickerIOSComponent;
