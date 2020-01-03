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
    Animated,
    AppState,
    Text,
    View,
    Image,
    Alert,
    Switch,
    PixelRatio, Dimensions
} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import DatePicker from './DatePicker';
import PickerHeader,{IProps as IPickerHeaderProps} from './PickerHeader';
//import ToastUtils from '../utils/toastUtils';

interface IProps extends IPickerHeaderProps {
    validate?: any,
    onNavigateBack?: any,
    onValueChange?: (startDate:Date, endDate:Date) => void,
    onlyFinishTrigger?: boolean,
    pickerProps?: any,
    errorMessage?: string,
    startDate?: Date | string,
    endDate?: Date | string,
    topErrorMessage?: boolean,
    startMinDate?: Date | string,
    startMaxDate?: Date | string,
    endMinDate?: Date | string,
    endMaxDate?: Date | string,
    style?: any
}

const {width:deviceWidth} = Dimensions.get('window');

export default class DateRangePicker extends PureComponent<IProps,any>{

    static propTypes = {
        //验证选择的时间段是否合法，返回包含结果和信息的对象
        validate:PropTypes.func,
        //将加过返回到上一级,必须
        onNavigateBack:PropTypes.func,
        //数据发生变化
        onValueChange:PropTypes.func.isRequired,
        //是否只在startTime和endTime都选中的情况下才触发onValueChange
        onlyFinishTrigger:PropTypes.bool.isRequired,
        pickerProps:PropTypes.object,
        errorMessage:PropTypes.string,
        startDate:PropTypes.oneOfType([PropTypes.instanceOf(Date),PropTypes.string]),
        endDate:PropTypes.oneOfType([PropTypes.instanceOf(Date),PropTypes.string]),
        //在删除按钮左边显示错误信息，主要用于modal显示
        topErrorMessage:PropTypes.bool,
        startMinDate:PropTypes.oneOfType([PropTypes.instanceOf(Date),PropTypes.string]),
        startMaxDate:PropTypes.oneOfType([PropTypes.instanceOf(Date),PropTypes.string]),
        endMinDate:PropTypes.oneOfType([PropTypes.instanceOf(Date),PropTypes.string]),
        endMaxDate:PropTypes.oneOfType([PropTypes.instanceOf(Date),PropTypes.string]),
    };

    static defaultProps = {
        showHeader: true,
        startMinDate:moment().add(-5,'year').toDate(),
        startMaxDate:moment().add(1,'year').toDate(),
        endMaxDate:moment().add(1,'year').toDate(),
        onlyFinishTrigger:true
    };


    constructor(props)
    {
        super(props);
        this.state={
            //0表示都没选中，1表示开始时间选中，2表示结束时间选中
            activeIndex:1,
            //都是索引号为0，代表值'0'
            startDate:props.startDate||null,
            endDate:props.endDate||null,
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
        return(
            <View style={[{minHeight:340+(this.props.showHeader?40:0)},this.props.style]}>
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
                <View style={{flexDirection:'row',paddingHorizontal:8,alignItems:'center',marginTop:18}}>
                    <TimeBaseView style={{flex:1}} index={1} activeIndex={this.state.activeIndex} onPress={this.timeClick} date={this.state.startDate}/>
                    <Text style={{marginHorizontal:6,color: '#666666'}}>至</Text>
                    <TimeBaseView style={{flex:1}} index={2} activeIndex={this.state.activeIndex} onPress={this.timeClick} date={this.state.endDate}/>
                </View>
                <View style={{height:40,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                    {this.props.topErrorMessage?
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
                                style={[localStyles.picker]}
                                showHeader={false}
                                pickerWrapperStyle={[localStyles.picker,{marginLeft:20}]}
                                minDate={startMinDate}
                                maxDate={startMaxDate}
                                date={this.state.startDate||new Date()}
                                onDateChange={(date)=>{
                                    this.setState({
                                        startDate:date
                                    },this.onValueChange);
                                }}
                                {...this.props.pickerProps}
                            />
                        </View>:null}
                    {this.state.activeIndex==2?
                        <View style={{flexDirection:'row',paddingHorizontal:8}}>
                            <DatePicker
                                style={[localStyles.picker]}
                                showHeader={false}
                                pickerWrapperStyle={[localStyles.picker,{marginLeft:20}]}
                                minDate={this.state.startDate||endMinDate}
                                maxDate={endMaxDate}
                                date={this.state.endDate||new Date()}
                                onDateChange={(date)=>{
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
                    activeIndex:0,
                    startDate:null,
                    endDate:null
                },()=>this.onValueChange());
                break;
            //开始时间
            case 1:
                if(!this.state.startDate)
                    this.setState({
                        activeIndex:1,
                        startDate:this.props.startDate||moment().add(-1,'days').toDate(),
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
                if(this.state.activeIndex === 0)
                {
                    //ToastUtils.showToast('请先选择开始日期');
                    return;
                }
                //如果结束时间没选择过,则结束时间拷贝开始时间
                if(!this.state.endDate)
                {
                    this.setState({
                        activeIndex:2,
                        endDate:this.props.endDate||null
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
            if(onlyFinishTrigger)
            {
                if(isNull(this.state.startDate)||isNull(this.state.endDate))
                {
                    //说明当前的数据是不全的
                    onValueChange('','');
                }
                else {
                    onValueChange(moment(this.state.startDate),
                        moment(this.state.endDate)
                    );
                }
            }
            else
            {
                if(isNull(this.state.startDate)&&isNull(this.state.endDate))
                {
                    onValueChange('','');
                }
                else{
                    const toStartTime = isNull(this.state.startDate)?'':moment(this.state.startDate);
                    const toEndTime = isNull(this.state.endDate)?'':moment(this.state.endDate);
                    onValueChange(toStartTime,toEndTime);
                }
            }
        }
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
