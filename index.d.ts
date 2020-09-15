declare module '@yz1311/react-native-wheel-picker' {
    import * as React from 'react';
    import { StyleProp, TextStyle, ViewProps, ViewStyle } from 'react-native';
    import { Component } from 'react';
  
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
    
    interface PickerProps extends ViewProps{
      style?: StyleProp<ViewStyle>,
      /**
       * Style to apply to each of the item labels.
       * @platform ios
       */
      itemStyle?: StyleProp<TextStyle>;
      selectedValue: number | string,
      onValueChange: (value: number | string) => any,
    }
  
  
    export default class WheelPicker extends React.Component<PickerProps,any>{
         static Item: typeof PickerIOSItem
    }

    export interface IPickerHeaderProps {
      pickerToolBarStyle?: StyleProp<ViewStyle>,
      pickerTitle?: string,
      pickerTitleStyle?: StyleProp<TextStyle>,
      pickerCancelBtnText?: string,
      pickerCancelBtnStyle?: StyleProp<TextStyle>,
      pickerConfirmBtnText?: string,
      pickerConfirmBtnStyle?: StyleProp<TextStyle>,
      onPickerCancel?: (value?:any)=>void,
      onPickerConfirm?: (value:any)=>void
    }

    /**
     * header的高度为40
     */
    export class PickerHeader extends React.Component<IPickerHeaderProps,any>{

    }
  

    interface ICommonPickerProps extends IPickerHeaderProps{
      style?: StyleProp<ViewStyle>,
      //默认值为true，如果设为false，则IPickerHeaderProps里面的属性均无效
      showHeader?: boolean,
      //包裹picker的容器的样式
      pickerWrapperStyle?: StyleProp<ViewStyle>,
      pickerElevation?: number,
      //picker数据
      pickerData: any,
      //已选择的值
      selectedValue: string | number | Array<string | number>,
      onPickerCancel?: (value:any) => void,
      onValueChange?: (value:any,wheelIndex:number) => void,
    }

    export class CommonPicker extends React.Component<ICommonPickerProps,any>{

    }
    
    interface IRegionPickerProps extends Omit<ICommonPickerProps,'onPickerConfirm'|'pickerData'> {
      data?:any,
      onPickerConfirm:(names:Array<string>,codes:Array<string>)=>void,
    }

    export class RegionPicker extends React.Component<IRegionPickerProps,any>{

    }

    interface IDatePickerProps extends Omit<IPickerHeaderProps,'onPickerConfirm'|'pickerData'|'selectedValue'> {
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
      //选择模式
      mode?: 'year' | 'month' | 'date' | 'time' | 'datetime',
      onDateChange?: (value:Date)=>void,
      style?: StyleProp<ViewStyle>,
      //默认值为true，如果设为false，则IPickerHeaderProps里面的属性均无效
      showHeader?: boolean,
      //包裹picker的容器的样式
      pickerWrapperStyle?: StyleProp<ViewStyle>,
      onPickerConfirm?: (value:Date)=>void
    }

    export class DatePicker extends React.Component<IDatePickerProps,any>{

    }

    interface IDateRangePickerProps extends Omit<ICommonPickerProps,'onValueChange'|'onPickerConfirm'|'pickerData'|'selectedValue'> {
      validate?: any,
      //暂无用处
      onNavigateBack?: any,
      //值发生变化回调函数
      onValueChange?: (startDate:Date, endDate:Date) => void,
      //点击pickerHeader右侧的确认按钮回调函数
      onPickerConfirm?: (startDate:Date, endDate:Date) => void,
      //暂无用处
      onlyFinishTrigger?: boolean,
      pickerProps?: any,
      //删除按钮的左侧，用于显示错误信息(红色), errorMessage不为空的时候就显示
      errorMessage?: string,
      //默认开始时间
      startDate?: Date | string,
      //默认结束时间
      endDate?: Date | string,
      //开始时间的最小时间
      startMinDate?: Date | string,
      //开始时间的最大时间
      startMaxDate?: Date | string,
      //结束时间的最小时间(如果开始时间不为空，则会被选择的开始时间覆盖)
      endMinDate?: Date | string,
      //结束时间的最大时间
      endMaxDate?: Date | string,
      style?: any
    }

    export class DateRangePicker extends React.Component<IDateRangePickerProps,any>{

    }
  }
  