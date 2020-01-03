/**
 * 日期/时间选择组件
 */

import React, {FC, PureComponent} from "react";
import {
    ColorPropType, 
    StyleProp,
    View,
    ViewPropTypes, 
    ViewStyle,
    Dimensions
} from "react-native";
import PropTypes from "prop-types";
import moment from "moment";
import CommonPicker, {IProps as ICommonPickerProps} from "./CommonPicker";
import PickerHeader,{IProps as IPickerHeaderProps} from './PickerHeader';


export interface IProps extends IPickerHeaderProps {
    labelUnit?: {
        year?: string,
        month?: string,
        date?: string,
        hour?: string,
        minute?: string,
        second?: string,
    },
    date?: Date,
    minDate?: Date,
    maxDate?: Date,
    mode?: 'date' | 'time' | 'datetime',
    onDateChange?: Function,
    style?: StyleProp<ViewStyle>,
    showHeader?: boolean,
    pickerWrapperStyle?: StyleProp<ViewStyle>,
}

export interface IState {
    selectedData1?: Date,
    selectedData2?: Date
}

export default class DatePicker extends PureComponent<IProps,IState>{

    static propTypes = {
        labelUnit: PropTypes.shape({
            year: PropTypes.string,
            month: PropTypes.string,
            date: PropTypes.string,
            hour: PropTypes.string,
            minute: PropTypes.string,
            second: PropTypes.string,
        }),
        date: PropTypes.instanceOf(Date).isRequired,
        maxDate: PropTypes.instanceOf(Date),
        minDate: PropTypes.instanceOf(Date),
        mode: PropTypes.oneOf(['date', 'time', 'datetime']),
        onDateChange: PropTypes.func.isRequired,
        style: ViewPropTypes.style,
    };

    static defaultProps = {
        showHeader: true,
        labelUnit: { year: '年', month: '月', date: '日', hour: '时', minute: '分', second: '秒' },
        mode: 'date',
        maxDate: moment().add(10, 'years').toDate(),
        minDate: moment().add(-10, 'years').toDate(),
        date: new Date(),
        style: null,
        textColor: '#333',
        textSize: 26,
        itemSpace: 20,
    };

    readonly state:IState = {
        selectedData1: null,
        selectedData2: null,
    };

    private targetDate:any;

    constructor(props:IProps) {
        super(props);
        switch (props.mode) {
            case 'date':
                this.state = {
                    selectedData1: this._genDateData(props),
                };
                break;
                //只选择时分,时分不关联
            case 'time':
                this.state = {
                    selectedData1: this._genTimeData(props),
                };
                break;
            case 'datetime':
                this.state = {
                    selectedData1: this._genDateData(props),
                    selectedData2: this._genTimeData(props)
                };
                break;
        }
        this.targetDate = props.date;
    }

    //生成日期数据 ，xxxx年xx月xx日
    _genDateData = (props)=>{
        let pickerData:any = {};
        let daysLength = moment(props.maxDate).diff(moment(props.minDate),'days');
        for (let i=0;i<=daysLength;i++) {
            let date = moment(props.minDate).add(i,'day');
            let yearKey = date.year()+props.labelUnit.year;
            let monthKey = (date.month()+1)+props.labelUnit.month;
            let dayKey = date.date()+props.labelUnit.date;
            //@ts-ignore
            if(pickerData[yearKey]==undefined) {
                pickerData[yearKey] = {};
            }
            if(pickerData[yearKey][monthKey]==undefined) {
                pickerData[yearKey][monthKey] = [];
            }
            pickerData[yearKey][monthKey].push(dayKey);
        }
        return pickerData;
    }

    //生成时间数据，xx时xx分，不支持秒
    _genTimeData = (prop)=>{
        let pickerData:any = {};
        const [hours, minutes] = [[], []];

        for (let i = 0; i <= 24; i += 1) {
            hours.push(`${i}${this.props.labelUnit.hour}`);
        }

        for (let i = 0; i <= 59; i += 1) {
            minutes.push(`${i}${this.props.labelUnit.minute}`);
        }
        pickerData = [hours, minutes];
        return pickerData;
    }

    _onDateChange = (date)=>{
        let targetDate = null;
        //合并两个date
        if(this.props.mode=='datetime') {
            targetDate = moment(moment(this.state.selectedData1).format('YYYY-MM-DD')+moment(this.state.selectedData2).format(' HH:mm:ss')).toDate();
        } else {
            targetDate = date;
        }
        this.targetDate = targetDate;
        this.props.onDateChange&&this.props.onDateChange(targetDate);
    }

    render () {
        const {width:deviceWidth} = Dimensions.get('window');
        const {labelUnit, mode} = this.props;
        let selectedValue1 = moment(this.props.date).format(`YYYY${labelUnit.year},
        MM${labelUnit.month},DD${labelUnit.date}`).split(',').map(x=>x.trim().replace(/^0+/g,''));
        let selectedValue2 = moment(this.props.date).format(`HH${labelUnit.month},
        mm${labelUnit.minute}`).split(',').map(x=>x.trim().replace(/^0+/g,''));
        let content = (<DatePickerView pickerData={this.state.selectedData1 as any} mode={this.props.mode} selectedValue={selectedValue1} labelUnit={labelUnit} onDateChange={this._onDateChange}/>)
        if(mode == 'datetime') {
            content = (
                <View style={{flexDirection: 'row', flex: 1}}>
                    <DatePickerView style={{width:deviceWidth*0.6}} pickerWrapperStyle={this.props.pickerWrapperStyle} pickerData={this.state.selectedData1 as any}  mode={this.props.mode} selectedValue={selectedValue1} labelUnit={labelUnit} onDateChange={this._onDateChange}/>
                    <DatePickerView style={{width:deviceWidth*0.4}} pickerWrapperStyle={this.props.pickerWrapperStyle} pickerData={this.state.selectedData2 as any}  mode={this.props.mode} selectedValue={selectedValue2} labelUnit={labelUnit} onDateChange={this._onDateChange}/>
                </View>
            );
        }
        return (
            <View style={[{minHeight:240+(this.props.showHeader?40:0)},this.props.style]}>
                {this.props.showHeader ?
                    <PickerHeader
                        {...this.props}
                        onPickerConfirm={()=>{
                            this.props.onPickerConfirm&&this.props.onPickerConfirm(this.targetDate);
                        }}
                    />
                    :
                    null
                }
                {content}
            </View>
        );
    }
}

export interface IDatePickerViewProps {
    style?:StyleProp<ViewStyle>,
    pickerWrapperStyle?:Pick<ICommonPickerProps,'pickerWrapperStyle'>,
    pickerData: any,
    selectedValue: any,
    labelUnit: any,
    onDateChange: any,
    mode: any
}

const DatePickerView:FC<IDatePickerViewProps>=({style,pickerWrapperStyle,pickerData,selectedValue,labelUnit,onDateChange,mode})=>{
    return (
        <CommonPicker
            style={style}
            pickerWrapperStyle={pickerWrapperStyle}
            showHeader={false}
            pickerData={pickerData}
            selectedValue={selectedValue}
            onValueChange={value => {
                let date: any;
                switch (mode) {
                    case 'date':
                        date = moment(value[0].replace(labelUnit.year, '')
                            + '-' + value[1].replace(labelUnit.month, '')
                            + '-' + value[2].replace(labelUnit.date, ''), 'YYYY-MM-DD').toDate()
                        break;
                    case 'time':
                        date = moment(value[0].replace(labelUnit.hour, '')
                            + '-' + value[1].replace(labelUnit.minute, ''), moment().format('YYYY-MM-DD') + ' HH:mm').toDate();
                        break;
                }
                onDateChange && onDateChange(date);
            }}
        />
    );
}
