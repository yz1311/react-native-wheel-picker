'use strict';

import React,{} from 'react';

import {
	Platform,
	NativeModules
} from 'react-native';

import WheelCurvedPicker from './WheelCurvedPicker'

import PickerHeader from './src/PickerHeader';

import CommonPicker from './src/CommonPicker';

import RegionPicker from './src/RegionPicker';

import DatePicker from './src/DatePicker';

import DateRangePicker from './src/DateRangePicker';

let PickerIOS = null;
if(Platform.OS === 'ios') {
	if(NativeModules.RNWPicker) {
		PickerIOS = require('./src/PickerIOS').default;
	} else {
		PickerIOS = require('react-native').PickerIOS;
	}
}

export {
	PickerHeader,
	CommonPicker,
	RegionPicker,
	DatePicker,
	DateRangePicker
};

export default (Platform.OS === 'ios' ? PickerIOS : WheelCurvedPicker);
