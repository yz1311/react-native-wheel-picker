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
    Dimensions,
    Text
} from "react-native";
import moment from "moment";
import CommonPicker from "./CommonPicker";
import PickerHeader from './PickerHeader';
import {IDatePickerProps as IProps} from '../types';


export interface IState {
    pickerData?: Array<any>,
    //默认选中的值，传递给CommonPicker设置默认值
    selectedDateArray: Array<string>;
}

export default class DatePicker extends PureComponent<IProps,IState>{

    static defaultProps = {
        showHeader: true,
        labelUnit: { year: '年', month: '月', date: '日', hour: '时', minute: '分', second: '秒' },
        mode: 'date',
        maxDate: moment().add(10, 'years').toDate(),
        minDate: moment().add(-30, 'years').toDate(),
        date: new Date(),
        style: null,
        textColor: '#333',
        textSize: 26,
        itemSpace: 20,
    };

    readonly state:IState = {
        pickerData: [],
        selectedDateArray: []
    };

    //当前选择的时间对象
    private targetDate: Date;

    componentDidMount() {
        this._setDefaultValue();
        this.setState({
            pickerData: this._genData()
        });
    }


    componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any) {
        if(this.props.date !== prevProps.date ||
            this.props.minDate !== prevProps.minDate ||
            this.props.maxDate !== prevProps.maxDate) {
            this._setDefaultValue();
        }
    }

    _setDefaultValue = (props:IProps = this.props)=>{
        //必须要给一个默认值，否则默认为当前时间
        if(!props.date || !moment(props.date).isValid()) {
            this.targetDate = moment().second(0).toDate();
        }  else {
            this.targetDate = props.date;
        }
        //如果超过范围，则默认显示最小值
        if(moment(this.targetDate).isBefore(props.minDate)
            || moment(this.targetDate).isAfter(props.maxDate)) {
            this.targetDate = moment(props.minDate).toDate();
        }
        const { labelUnit, mode } = props;
        let dataArray = [];
        let yearWithUnit = moment(this.targetDate).year()+labelUnit.year;
        let monthWithUnit = (moment(this.targetDate).month()+1)+labelUnit.month;
        let dateWithUnit = moment(this.targetDate).date()+labelUnit.date;
        let hourWithUnit = moment(this.targetDate).hour()+labelUnit.hour;
        let minuteWithUnit = moment(this.targetDate).minute()+labelUnit.minute;
        switch (props.mode) {
            case 'year':
                dataArray = [yearWithUnit];
                break;
            case 'month':
                dataArray = [yearWithUnit, monthWithUnit];
                break;
            case 'date':
                dataArray = [yearWithUnit, monthWithUnit, dateWithUnit];
                break;
            case 'time':
                dataArray = [hourWithUnit, minuteWithUnit];
                break;
            case 'datetime':
                dataArray = [yearWithUnit, monthWithUnit, dateWithUnit, hourWithUnit, minuteWithUnit];
                break;
        }
        this.setState({
            selectedDateArray: dataArray
        });
    }

    _genData = (props:IProps = this.props) => {
        if(moment(props.maxDate).isBefore(moment(props.minDate))
            || !moment(props.minDate).isValid()
            || !moment(props.maxDate).isValid()) {
            console.log('maxDate不能小于minDate')
            return [];
        }
        //年份
        let years = new Set();
        for (let i = moment(props.minDate).year();i<=moment(props.maxDate).year();i++) {
            years.add(i+props.labelUnit.year);
        }
        let currentYear = moment(this.targetDate).year();
        //0-11
        let currentMonth = moment(this.targetDate).month();

        //月份
        let monthes = this._getMonthesByYear(props, currentYear);

        //天数
        let days = this._getDaysByYearAndMonth(props, currentYear, currentMonth);

        switch (props.mode) {
            case 'year':
                return [Array.from(years)];
            case 'month':
                return [Array.from(years), Array.from(monthes)]
            case 'date':
                return [Array.from(years), Array.from(monthes), Array.from(days)]
            case 'time':
                return this._genTimeData(props);
            case 'datetime':
                return [Array.from(years), Array.from(monthes), Array.from(days), ...this._genTimeData(props)];
            default:
                return [];
        }
    }

    _getMonthesByYear = (props:IProps = this.props, currentYear)=>{
        //月份(moment取到的月份是0-11)
        let monthes = new Set();
        if(props.mode !== 'year' && props.mode !== 'time') {
            //默认是12个月
            for (let i = 1; i <= 12; i++) {
                monthes.add(i + props.labelUnit.month);
            }
            //如果跟最小值的年份一样，去除之前的月份
            if (moment(props.minDate).year() === currentYear) {
                for (let i = 1; i < moment(props.minDate).month() + 1; i++) {
                    monthes.delete(i + props.labelUnit.month)
                }
            }
            //如果跟最大值的年份一样，去除之后的月份
            if (moment(props.maxDate).year() === currentYear) {
                for (let i = moment(props.maxDate).month() + 2; i <= 12; i++) {
                    monthes.delete(i + props.labelUnit.month)
                }
            }
        }
        return monthes;
    }

    //currentMonth是0-11
    _getDaysByYearAndMonth = (props:IProps = this.props, currentYear, currentMonth)=>{
        let days = new Set();
        if(props.mode !== 'year' && props.mode !== 'month' && props.mode !== 'time') {
            //获取当前年月的天数
            let daysInMonth = moment().year(currentYear).month(currentMonth).daysInMonth();
            for (let i = 1; i <= daysInMonth; i++) {
                days.add(i + props.labelUnit.date);
            }
            //如果跟最小值的年份月份一样，去除之前的天数
            if (moment(props.minDate).year() === currentYear &&
                moment(props.minDate).month() === currentMonth) {
                for (let i = 1; i < moment(props.minDate).date(); i++) {
                    days.delete(i + props.labelUnit.date)
                }
            }
            //如果跟最大值的年份月份一样，去除之后的天数
            if (moment(props.maxDate).year() === currentYear &&
                moment(props.maxDate).month() === currentMonth) {
                //最多是31天
                for (let i = moment(props.maxDate).date() + 1; i <= 31; i++) {
                    days.delete(i + props.labelUnit.date)
                }
            }
        }
        return days;
    }

    //生成时间数据，xx时xx分，不支持秒
    _genTimeData = (prop)=>{
        let pickerData:any = {};
        const [hours, minutes] = [[], []];

        for (let i = 0; i < 24; i += 1) {
            hours.push(`${i}${this.props.labelUnit.hour}`);
        }

        for (let i = 0; i <= 59; i += 1) {
            minutes.push(`${i}${this.props.labelUnit.minute}`);
        }
        pickerData = [hours, minutes];
        return pickerData;
    }

    _getNewMonthesAndSelectedMonthByYear = (yearWithUnit, monthWithUnit) =>{
        const {mode, labelUnit} = this.props;
        let nextMonthes = this._getMonthesByYear(this.props, parseInt(yearWithUnit.replace(labelUnit.year, '')));
        //如果更新的月份依旧存在
        let nextMonthArray = Array.from(nextMonthes);
        if(nextMonthes.has(monthWithUnit)) {
            return [nextMonthArray, monthWithUnit];
        } else {
            //没有，则默认选中第一个月份
            return [nextMonthArray, nextMonthArray[0]]
        }
    }


    _getNewDaysAndSelectedDayByYearAndMonth = (yearWithUnit, monthWithUnit, dayWithUnit)=>{
        const {mode, labelUnit} = this.props;
        let nextDays = this._getDaysByYearAndMonth(this.props,
            parseInt(yearWithUnit.replace(labelUnit.year, '')),
            parseInt(monthWithUnit.replace(labelUnit.month, ''))-1);
        //如果更新的月份依旧存在
        let nextDayArray = Array.from(nextDays);
        if(nextDays.has(dayWithUnit)) {
            return [nextDayArray, dayWithUnit];
        } else {
            //原来是28(一个月最少28天)以上，并且新的当月天数小于原来的数字，夸月导致的变更，直接选最后一天
            let lastDayInt = parseInt(dayWithUnit.replace(labelUnit.date, ''));
            //选择最后一天
            if(lastDayInt>28 && nextDayArray.length<lastDayInt) {
                return [nextDayArray, nextDayArray[nextDayArray.length-1]];
            }
            //否则选择第一天(此时是因为最大值和最小值引起的变更)
            return [nextDayArray, nextDayArray[0]]
        }
    }

    //根据数组转换成moment对象
    _dataArrayToMoment = (dataArray: Array<any>)=>{
        const {mode,labelUnit } = this.props;
        let date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD');
        switch (mode) {
            case 'year':
                date.year(dataArray[0].replace(labelUnit.year, ''));
                break;
            case 'month':
                date.year(dataArray[0].replace(labelUnit.year, ''))
                    .month(parseInt(dataArray[1].replace(labelUnit.month, ''))-1);
                break;
            case 'date':
                date.year(dataArray[0].replace(labelUnit.year, ''))
                    .month(parseInt(dataArray[1].replace(labelUnit.month, ''))-1)
                    .date(dataArray[2].replace(labelUnit.date, ''));
                break;
            case 'time':
                date.hour(dataArray[0].replace(labelUnit.hour, ''))
                    .minute(dataArray[1].replace(labelUnit.minute, ''));
                break;
            case 'datetime':
                date.year(dataArray[0].replace(labelUnit.year, ''))
                    .month(parseInt(dataArray[1].replace(labelUnit.month, ''))-1)
                    .date(dataArray[2].replace(labelUnit.date, ''))
                    .hour(dataArray[3].replace(labelUnit.hour, ''))
                    .minute(dataArray[4].replace(labelUnit.minute, ''));
                break;
        }
        return date;
    }

    _onDateChange = (value, wheelIndex)=>{
        const {mode, labelUnit} = this.props;
        //虽然值改变了，但是实际选中的值可能会变化
        let nextValue = [...value];
        let nextPickerData = [...this.state.pickerData];
        switch (mode) {
            case 'year':
                //不用说，直接改变即可

                break;
            case 'month':
                //改变的是年份
                //可能会根据最大最小时间影响月份的数据
                if(wheelIndex == 0) {
                    const [monthes, newMonthWithUnit] = this._getNewMonthesAndSelectedMonthByYear(value[0], value[1]);
                    nextValue[1] = newMonthWithUnit;
                    nextPickerData[1] = monthes;
                } else {
                    //月份没啥影响
                }
                break;
            case 'date':
            //必须是date在前，time在后的形式才能合并
            case 'datetime':
                if(wheelIndex === 0) {
                    const [monthes, newMonthWithUnit] = this._getNewMonthesAndSelectedMonthByYear(value[0], value[1]);
                    const [days, newDayWithUnit] = this._getNewDaysAndSelectedDayByYearAndMonth(value[0], newMonthWithUnit, value[2]);
                    nextValue[1] = newMonthWithUnit;
                    nextValue[2] = newDayWithUnit;
                    nextPickerData[1] = monthes;
                    nextPickerData[2] = days;
                } else if(wheelIndex === 1) {
                    const [days, newDayWithUnit] = this._getNewDaysAndSelectedDayByYearAndMonth(value[0], value[1], value[2]);
                    nextValue[2] = newDayWithUnit;
                    nextPickerData[2] = days;
                } else if(wheelIndex === 2) {
                    //没啥影响
                }
                break;
        }
        let nextDate = this._dataArrayToMoment(nextValue);
        this.setState({
            selectedDateArray: nextValue,
            pickerData: nextPickerData
        });
        this.targetDate = nextDate.toDate();
        this.props.onDateChange&&this.props.onDateChange(nextDate.toDate());
    }

    render () {
        const {mode, labelUnit, isModal, modalProps, modalVisible, onModalVisibleChange} = this.props;
        const { width: deviceWidth } = Dimensions.get('window');
        const pickerView = (
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
                {this.state.pickerData.length > 0 ?
                    <CommonPicker
                        style={{width: deviceWidth}}
                        pickerWrapperStyle={this.props.pickerWrapperStyle}
                        wheelStyles={this.props.mode === 'datetime'?[{minWidth: 20}]:[]}
                        showHeader={false}
                        pickerData={this.state.pickerData}
                        selectedValue={this.state.selectedDateArray}
                        onValueChange={(value, wheelIndex) => {
                            this._onDateChange(value, wheelIndex);
                        }}
                    />
                    :
                    <View style={[{flex:1, backgroundColor:'white', justifyContent:'center', alignItems:'center'}, this.props.pickerWrapperStyle]}>
                        <Text style={{fontSize: 16, color:'#999999'}}>数据异常,请检查参数</Text>
                    </View>
                }
            </View>
        );
        if(isModal) {
            const Modal = require('react-native-modal').default;
            if(Modal) {
                return (
                    <Modal
                        onBackdropPress={()=>{
                            onModalVisibleChange&&onModalVisibleChange(false);
                        }}
                        onBackButtonPress={()=>{
                            onModalVisibleChange&&onModalVisibleChange(false);
                        }}
                        {...(modalProps||{})}
                        style={[{flex:1, justifyContent:'flex-end',margin: 0}, (modalProps||{style: undefined}).style]}
                        isVisible={modalVisible}
                    >
                        {pickerView}
                    </Modal>
                );
            }
        }
        return pickerView;
    }
}
