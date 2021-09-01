/**
 * cascade级联日期选择器(前一个选择后，后面一个会被清除掉)
 */
/**
 * startMinDate默认为当前用户的创建时间
 * endMinDate默认为startDate
 */
import React, {Component,PureComponent} from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    Image,
    Alert,
    Switch,
    PixelRatio, Dimensions
} from 'react-native';
import moment from 'moment';
import DatePicker from './DatePicker';
import PickerHeader from './PickerHeader';
import {IDateRangePickerProps as IProps} from '../types';
//import ToastUtils from '../utils/toastUtils';


const {width:deviceWidth} = Dimensions.get('window');

export default class DateRangePicker extends PureComponent<IProps,any>{


    static defaultProps = {
        showHeader: true,
        startMinDate: moment().add(-30,'year').toDate(),
        startMaxDate: moment().add(10,'year').toDate(),
        endMaxDate: moment().add(10,'year').toDate(),
        onlyFinishTrigger:true
    };


    constructor(props)
    {
        super(props);
        this.state={
            //0表示都没选中，1表示开始时间选中，2表示结束时间选中
            activeIndex:1,
            //都是索引号为0，代表值'0'
            startDate: props.startDate||new Date(),
            endDate: props.endDate||null,
            selectedYear2:'',
            selectedMonth2:'',
            status:true
        };
    }

    componentDidMount()
    {
        //用户还原初始数据后，刷新'保存'按钮的状态
        this.onValueChange();
    }

    render(){
        const {startMinDate,startMaxDate,endMinDate,endMaxDate} = this.props;
        const {isModal, modalProps, modalVisible, onModalVisibleChange} = this.props;
        const pickerView = (
            <View style={[{backgroundColor: 'white', minHeight:340+(this.props.showHeader?40:0)},this.props.style]}>
                {this.props.showHeader ?
                    <PickerHeader
                        {...this.props}
                        onPickerConfirm={()=>{
                            let values = this._getValues();
                            this.props.onPickerConfirm&&this.props.onPickerConfirm(values[0], values[1]);
                        }}
                    />
                    :
                    null
                }
                <View style={{flexDirection:'row',paddingHorizontal:8,alignItems:'center',marginTop:18}}>
                    <TimeBaseView style={{flex:1}} index={1} activeIndex={this.state.activeIndex} onPress={this.timeClick} date={this.state.startDate}/>
                    <Text style={{marginHorizontal:6,color: '#666666'}}>至</Text>
                    <TimeBaseView style={{flex:1}} index={2} activeIndex={this.state.activeIndex} onPress={this.timeClick} date={this.state.endDate}/>
                </View>
                <View style={{height:40,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                    {this.props.errorMessage?
                        <Text style={{alignSelf:'center',color:'#ff4141',fontSize:14,marginLeft:10}}>{this.props.errorMessage}</Text>
                        :
                        <View />
                    }
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={{paddingHorizontal:10,paddingLeft:20,alignSelf:'stretch',justifyContent:'center'}}
                        onPress={()=>this.timeClick(0)}
                    >
                        <Image style={{width:20,height:20}} resizeMode='contain' source={require('./resource/trash.png')} />
                    </TouchableOpacity>
                </View>
                <View style={{minHeight:220,flex:1}}>
                    {this.state.activeIndex!=0?
                        <View
                            style={{height:1/PixelRatio.get(),backgroundColor:'#d9d9d9',marginBottom:10}}
                        />:null}
                    {this.state.activeIndex==1?
                        <View style={{flexDirection:'row',paddingHorizontal:8}}>
                            <DatePicker
                                {...this.props}
                                isModal={false}
                                style={[localStyles.picker]}
                                showHeader={false}
                                pickerWrapperStyle={[localStyles.picker,{marginLeft:20}]}
                                minDate={startMinDate}
                                maxDate={startMaxDate}
                                date={this.state.startDate||new Date()}
                                onDateChange={(date)=>{
                                    if(this.state.endDate && moment(date).isAfter(moment(this.state.endDate))) {
                                        this.setState({
                                            startDate:date,
                                            //开始日期比结束日期大,需要置空结束日期
                                            endDate: ''
                                        },this.onValueChange);
                                    } else {
                                        this.setState({
                                            startDate:date
                                        },this.onValueChange);
                                    }
                                }}
                                {...this.props.pickerProps}
                            />
                        </View>:null}
                    {this.state.activeIndex==2?
                        <View style={{flexDirection:'row',paddingHorizontal:8}}>
                            <DatePicker
                                {...this.props}
                                isModal={false}
                                style={[localStyles.picker]}
                                showHeader={false}
                                pickerWrapperStyle={[localStyles.picker,{marginLeft:20}]}
                                minDate={this.state.startDate||endMinDate}
                                maxDate={endMaxDate}
                                date={this.state.endDate||new Date()}
                                onDateChange={(date)=>{
                                    //不可能出现选择结束日期能比开始日期大，因为限制了
                                    this.setState({
                                        endDate:date
                                    },this.onValueChange);
                                }}
                                {...this.props.pickerProps}
                            />
                        </View>:null}
                </View>
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

    timeClick=(index)=>{
        if(this.state.activeIndex==index)
        {
            return;
        }
        switch (index)
        {
            //清空
            case 0:
                this.setState({
                    activeIndex: 1,
                    startDate: new Date(),
                    endDate:null
                },()=>this.onValueChange());
                break;
            //开始时间
            case 1:
                if(!this.state.startDate)
                    this.setState({
                        activeIndex:1,
                        startDate:this.props.startDate||moment().toDate(),
                    },()=>this.onValueChange());
                else
                {
                    this.setState({
                        activeIndex:1,
                    });
                }
                break;
            //结束时间
            case 2:
                //必须先选择开始时间
                if(this.state.activeIndex === 0 || this.state.activeIndex === 1&&!this.state.startDate)
                {
                    //ToastUtils.showToast('请先选择开始日期');
                    return;
                }
                //如果结束时间没选择过,则结束时间拷贝开始时间
                if(!this.state.endDate)
                {
                    this.setState({
                        activeIndex:2,
                        endDate: this.state.startDate||null
                    },()=>this.onValueChange());
                }
                else
                {
                    this.setState({
                        activeIndex:2
                    });
                }
                break;
        }
    }


    onValueChange = ()=>{
        //即使为空，也要传递过去，因为父组件可能需要验证数据
        // if(isNull(this.state.selectedYear1)||isNull(this.state.selectedMonth1)||isNull(this.state.selectedYear2)||isNull(this.state.selectedMonth2))
        // {
        //     return;
        // }
        const {onValueChange,onlyFinishTrigger} = this.props;
        if(onValueChange)
        {
            let values = this._getValues();
            //如果结束日期大于开始时间，则置空结束时间(出现这种情况只可能是选择完结束日期后，又更改开始日期)
            onValueChange(values[0], values[1]);
        }
    }

    _getValues = ()=>{
        const {onlyFinishTrigger} = this.props;
        let toStartTime = '' as any, toEndTime = '' as any;
        if(onlyFinishTrigger) {
            if(isNull(this.state.startDate)||isNull(this.state.endDate))
            {
                //说明当前的数据是不全的
                toStartTime = '';
                toEndTime = '';
            }
            else {
                toStartTime = moment(this.state.startDate);
                toEndTime = moment(this.state.endDate);
            }
        } else {
            if(isNull(this.state.startDate)&&isNull(this.state.endDate))
            {
                toStartTime = '';
                toEndTime = '';
            }
            else{
                toStartTime = isNull(this.state.startDate)?'':moment(this.state.startDate);
                toEndTime = isNull(this.state.endDate)?'':moment(this.state.endDate);
            }
        }
        return [toStartTime?toStartTime.toDate():null, toEndTime?toEndTime.toDate():null];
    }

    showInfo = (text) => {
        Alert.alert(
            ``,
            text,
            [{text:'确定',onPress:()=>console.log('取消')}],
            { cancelable: false }
        );
    }


}


const isNull = (value)=>{
    if(value===null||value===undefined||value===''||isNaN(value))
    {
        return true;
    }
    return false;
};


const TimeBaseView = ({style,index,activeIndex,onPress,date})=>{
    let title ;
    switch (index)
    {
        case 1:
            title='开始时间';
            break;
        case 2:
            title='结束时间';
            break;
    }
    if(date&&date!=':')
    {
        title = moment(date).format('YYYY-MM-DD');
    }
    else
    {

    }
    let color;
    //选中
    if(activeIndex==index)
    {
        color = '#0a86fa';
    }
    else
    {
        color = '#999999';
    }
    return(
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={()=>onPress(index)}
            style={[style]}
        >
            <View style={{alignItems:'center'}}>
                {/*因为汉字和数字的高度不一样，所以设置一个固定的高度*/}
                <Text style={{fontSize:16,color:color,height:19}}>{title}</Text>
                <View style={{height:1/PixelRatio.get(),backgroundColor:color,marginTop:10,alignSelf:'stretch'}}/>
            </View>
        </TouchableOpacity>
    );
};

const SwitchView =({title,onValueChange,value,isInfo,onPress})=>{
    return(
        <View style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection:'row',
            height:50,
            width:deviceWidth,
            backgroundColor: '#ffffff',
            borderBottomWidth: 1/PixelRatio.get(),
            borderTopWidth: 1/PixelRatio.get(),
            borderColor: '#e9e9e9',
            paddingHorizontal: 8}}>
            <View style={{flexDirection:'row',width:deviceWidth-50}}>
                <Text style={{color:'#333333',fontSize:15}}>{title}</Text>
                {isInfo?
                    <TouchableOpacity onPress={()=>onPress()}>
                        <Text style={{
                            width:16,
                            height:16,
                            borderRadius:8,
                            borderColor:'#0a86fa',
                            borderWidth:1/PixelRatio.get(),
                            marginLeft:5,
                            textAlign:'center',
                            color:'#0a86fa',
                            fontSize:12}}>?</Text>
                    </TouchableOpacity>:null}
            </View>
            <View style={{width:50}}>
                <Switch
                    value = {value}
                    onValueChange = {()=>onValueChange()}
                />
            </View>
        </View>
    );
};

const localStyles = StyleSheet.create({
    picker:{
        flex:1,
        // height: 180,
    },
});
