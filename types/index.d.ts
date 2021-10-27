import * as React from 'react';
import {Omit, StyleProp, TextStyle, ViewProps, ViewStyle} from 'react-native';
import { Component } from 'react';
import {ModalProps} from 'react-native-modal';

/**
 * @see PickerIOS.ios.js
 */
export interface PickerIOSItemProps {
    value?: string | number;
    label?: string;
}

/**
 * @see PickerIOS.ios.js
 */
export class PickerIOSItem extends React.Component<PickerIOSItemProps> {}

/**
 * @see Picker.js
 */
export interface PickerItemProps {
    testID?: string;
    color?: string;
    label: string;
    value?: any;
}

export class PickerItem extends React.Component<PickerItemProps> {}

interface PickerProps extends ViewProps {
    style?: StyleProp<ViewStyle>,
    /**
     * 指定应用在每项标签上的样式。
     */
    itemStyle?: StyleProp<TextStyle>;
    /**
     * 默认选中的值。可以是字符串或整数。
     */
    selectedValue: number | string;
    /**
     * 某一项被选中时执行此回调
     */
    onValueChange: (value: number | string) => any;
    /**
     * 设置滚轮选择器是否显示指示器 (android only)
     */
    indicator?: boolean;
    /**
     * 设置滚轮选择器指示器颜色 (android only)
     */
    indicatorColor?: string;
}


/**
 * 底层的Wheel原生组件，iOS端基于RN自带的PickerIOS组件，android端封装的[https://github.com/AigeStudio/WheelPicker]
 * 所以其他Picker组件均基于该组件进行封装
 */
export default class WheelPicker extends React.Component<PickerProps,any> {
    static Item: typeof PickerIOSItem;
    static defaultProps: Partial<PickerProps>;
}

/**
 * 所有Picker组件的公用header组件
 */
export interface IPickerHeaderProps {
    /**
     * 最外层容器样式
     */
    pickerToolBarStyle?: StyleProp<ViewStyle>,
    /**
     * 标题
     */
    pickerTitle?: string,
    /**
     * 标题样式
     */
    pickerTitleStyle?: StyleProp<TextStyle>,
    /**
     * 左侧的按钮文本(默认值: 取消)
     */
    pickerCancelBtnText?: string,
    /**
     * 左侧的按钮容器样式
     */
    pickerCancelBtnStyle?: StyleProp<ViewStyle>,
    /**
     * 左侧的按钮文字样式
     */
    pickerCancelBtnTextStyle?: StyleProp<TextStyle>,
    /**
     * 右侧的按钮文本(默认值: 确定)
     */
    pickerConfirmBtnText?: string,
    /**
     * 右侧的按钮容器样式
     */
    pickerConfirmBtnStyle?: StyleProp<TextStyle>,
    /**
     * 右侧的按钮文字样式
     */
    pickerConfirmBtnTextStyle?: StyleProp<TextStyle>,
    /**
     * 左侧的按钮回调事件
     */
    onPickerCancel?: (value?:any)=>void,
    /**
     * 右侧的按钮回调事件
     */
    onPickerConfirm?: (value:any)=>void
}

/**
 * header的高度为40
 */
export class PickerHeader extends React.Component<IPickerHeaderProps,any> {

}

/**
 * modal模式相关的属性
 */
interface IPickerModalProps {
    /**
     * 是否为底部弹窗模式，默认为false
     * 使用 https://github.com/react-native-community/react-native-modal 作为弹窗
     */
    isModal?: boolean;
    modalVisible?: boolean;
    onModalVisibleChange?: (visible: boolean)=>void;
    /**
     * modal组件的属性
     */
    modalProps?: Partial<Omit<ModalProps, 'children'|'isVisible'>>;
}


export interface ICommonPickerProps extends IPickerHeaderProps, IPickerModalProps, Pick<PickerProps, 'itemStyle'|'indicator'|'indicatorColor'> {
    style?: StyleProp<ViewStyle>;
    /**
     * 默认值为true，如果设为false，则IPickerHeaderProps里面的属性均无效
     */
    showHeader?: boolean;
    /**
     * 包裹picker的容器的样式
     */
    pickerWrapperStyle?: StyleProp<ViewStyle>;
    /**
     * 单个wheel的样式
     */
    wheelStyles?: Array<StyleProp<ViewStyle>>;
    pickerElevation?: number;
    /**
     * picker数据
     */
    pickerData: any;
    /**
     * 已选择的值
     */
    selectedValue: string | number | Array<string | number>;
    onPickerCancel?: (value:any) => void;
    onValueChange?: (value:any,wheelIndex:number) => void;
}

export class CommonPicker extends React.Component<ICommonPickerProps,any> {

}

export interface IRegionPickerProps extends Omit<ICommonPickerProps,'onPickerConfirm'|'pickerData'> {
    /**
     * 传递自定义的json文件,默认使用内置的数据源
     */
    data?:any,
    /**
     * 模式，下面三个值分别代表省、省市、省市区 三种模式,默认是pca
     */
    mode?: 'p' | 'pc' | 'pca',
    /**
     * names: 名称，譬如["湖北省", "武汉市", "洪山区"],根据mode的不同返回不同长度的数组
     * codes: 编号，譬如["42", "4201", "420111"],根据mode的不同返回不同长度的数组
     */
    onPickerConfirm:(names:Array<string>,codes:Array<string>)=>void,
}

export class RegionPicker extends React.Component<IRegionPickerProps,any>{

}

export interface IDatePickerProps extends Omit<ICommonPickerProps, 'selectedValue'|'onValueChange'|'pickerData'|'onPickerConfirm'> {
    //年月日单位，默认为：年 月 日 时 分 秒
    labelUnit?: {
        year?: string,
        month?: string,
        date?: string,
        hour?: string,
        minute?: string,
        second?: string,
    },
    //初始默认值,默认为当前时间
    date?: Date,
    //最小日期,默认为当前时间的前10年
    minDate?: Date,
    //最大日期,默认为当前时间的后10年
    maxDate?: Date,
    /**
     * 选择模式
     */
    mode?: 'year' | 'month' | 'date' | 'time' | 'datetime',
    onDateChange?: (value:Date)=>void,
    /**
     * 确定回调事件
     * 无论哪种模式均返回一个date对象，需要自己格式化数据
     */
    onPickerConfirm?: (value:Date)=>void
}

export class DatePicker extends React.Component<IDatePickerProps,any> {

}

export interface IDateRangePickerProps extends Omit<ICommonPickerProps,'onValueChange'|'onPickerConfirm'|'pickerData'|'selectedValue'> {
    /**
     * 验证选择的时间段是否合法，返回包含结果和信息的对象
     */
    validate?: any,
    /**
     * 暂无用处
     */
    onNavigateBack?: any,
    /**
     * 值发生变化回调函数
     */
    onValueChange?: (startDate:Date, endDate:Date) => void,
    /**
     * 点击pickerHeader右侧的确认按钮回调函数
     */
    onPickerConfirm?: (startDate:Date, endDate:Date) => void,
    /**
     * 暂无用处
     * 是否只在startTime和endTime都选中的情况下才触发onValueChange
     */
    onlyFinishTrigger?: boolean,
    pickerProps?: any,
    /**
     * 删除按钮的左侧，用于显示错误信息(红色), errorMessage不为空的时候就显示
     */
    errorMessage?: string,
    /**
     * 默认开始时间
     */
    startDate?: Date | string,
    /**
     * 默认结束时间
     */
    endDate?: Date | string,
    /**
     * 开始时间的最小时间
     */
    startMinDate?: Date | string,
    /**
     * 开始时间的最大时间
     */
    startMaxDate?: Date | string,
    /**
     * 结束时间的最小时间(如果开始时间不为空，则会被选择的开始时间覆盖)
     */
    endMinDate?: Date | string,
    /**
     * 结束时间的最大时间
     */
    endMaxDate?: Date | string,
}

export class DateRangePicker extends React.Component<IDateRangePickerProps,any> {

}
