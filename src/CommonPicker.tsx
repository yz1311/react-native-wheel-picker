/**
 * 注意点:
 * 1.需要保证每一列的数据不会有重复的(重复了也会兼容)
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Animated,
    Platform,
    Dimensions,
    PickerIOS,
    ViewPropTypes, StyleProp, ViewStyle, TextStyle,
} from 'react-native';
import PropTypes from 'prop-types';
import WheelCurvedPicker from '../WheelCurvedPicker';

const Picker = (Platform.OS === 'ios' ? PickerIOS : WheelCurvedPicker)
let PickerItem = Picker.Item;
let {width, height} = Dimensions.get('window');
import PickerHeader ,{IProps as IPickerHeaderProps} from './PickerHeader';


export interface IProps extends IPickerHeaderProps{
    style?: StyleProp<ViewStyle>,
    //默认值为true，如果设为false，则IPickerHeaderProps里面的属性均无效
    showHeader?: boolean,
    pickerWrapperStyle?: StyleProp<ViewStyle>,
    pickerElevation?: number,
    pickerData: any,
    //已选择的值
    selectedValue: string | number | Array<string | number>,
    onPickerCancel?: (value:any) => void,
    onValueChange?: (value:any,wheelIndex:number) => void,
}

export interface IState {
    style?: any,
    pickerElevation?: number,
    selectedValue: any,
    wheelSelectedIndexes: Array<number>,
    //为了避免key排序的问题，级联数据的key都是string类型
    pickerData: Array<any> | {
        [key:string]: Array<any>
    } | {
        [key:string]: Array<{
            [key:string]: Array<any>
        }>
    },
    wheelDatas: Array<Array<string | number>>
}

export default class CommonPicker extends Component<IProps,IState> {


    static defaultProps = {
        showHeader: true,
        pickerConfirmBtnText: '确定',
        pickerCancelBtnText: '取消',
        selectedValue: []
    };

    private pickerStyle: 'parallel' | 'cascade';
    private pickedValue: any;
    private wheelRefs:Array<Picker> = [];
    private wheelSelectedIndexes: Array<number>;

    constructor(props, context){
        super(props, context);
        this.state = this._getStateFromProps(props);
    }

    componentDidMount(): void {
        if(this.pickerStyle == 'cascade') {
            this._getCascadeData(this.props.pickerData,true, this.props.selectedValue as Array<any>);
        }
    }

    componentWillReceiveProps(newProps){
        let newState = this._getStateFromProps(newProps);
        this.setState(newState,()=>{
            if(this.pickerStyle == 'cascade') {
                this._getCascadeData(newProps.pickerData,true, newProps.selectedValue);
            }
        });
    }

    UNSAFE_componentWillReceiveProps(nextProps: Readonly<IProps>, nextContext: any): void {
        this.componentWillReceiveProps(nextProps);
    }

    //获取级联对象的深度
    //如果值是一个数组，则到此为止，如果是一个对象，则还有下一级
    //中途的元素可能终止和下一级的情况，同时存在
    _getDeepLength = (node,length=0)=>{
        if(Array.isArray(node)) {
            //不算空数组，都算一层
            return length+(node.length>0?1:0);
        }
        length++;
        let keys = Object.keys(node);
        let tempLengths = [];
        for (let key of keys) {
            tempLengths.push(this._getDeepLength(node[key],length));
        }
        return Math.max(...tempLengths);
    }

    _getStateFromProps(props){
        //the pickedValue must looks like [wheelone's, wheeltwo's, ...]
        //this.state.selectedValue may be the result of the first pickerWheel
        let {pickerData, selectedValue} = props;
        //兼容错误数据,并且让picker能展示出来
        if(pickerData==undefined||Object.keys(pickerData).length==0||pickerData.length==0) {
            pickerData = [['']];
        }
        let pickerStyle = pickerData.constructor === Array ? 'parallel' : 'cascade';
        let wheelSelectedIndexes;
        let cascadeData = {} as any;

        if(pickerStyle === 'parallel'){
            wheelSelectedIndexes = Array.from({length: pickerData.length});
            //compatible single wheel sence
            if(selectedValue&&selectedValue.constructor !== Array){
                selectedValue = [selectedValue];
            }
            for (let index in pickerData) {
                let wheelData = pickerData[index];
                if(!Array.isArray(wheelData)) {
                    console.warn('parallel模式，数组内部也必须全部是数组');
                    wheelData = [wheelData];
                }
                //默认取第一个元素
                wheelSelectedIndexes[index] = 0;
                //还原数据
                if(parseInt(index+'')<=selectedValue.length-1) {
                    let findIndex = wheelData.findIndex(x=>x==selectedValue[index]);
                    if(findIndex>0) {
                        wheelSelectedIndexes[index] = findIndex;
                    }
                }
            }
            if(pickerData[0].constructor !== Array){
                pickerData = [pickerData];
            }
            this.wheelSelectedIndexes  = wheelSelectedIndexes;
        }
        else if(pickerStyle === 'cascade'){
            //找出级别
            let maxDeepLength = this._getDeepLength(pickerData,0);
            wheelSelectedIndexes = Array.from({length: maxDeepLength});
            this.wheelSelectedIndexes = wheelSelectedIndexes;
        }
        //save picked data
        this.pickedValue = JSON.parse(JSON.stringify(selectedValue));
        this.pickerStyle = pickerStyle as any;

        let result = {
            ...props,
            pickerData,
            selectedValue,
            wheelDatas: cascadeData.wheelDatas,
            wheelSelectedIndexes: wheelSelectedIndexes,
        };
        return result;
    }

    _pickerCancel = () =>{
        this.props.onPickerCancel&&this.props.onPickerCancel(this.pickedValue);
    }

    _pickerConfirm = () =>{
        this.props.onPickerConfirm&&this.props.onPickerConfirm(this.pickedValue);
    }

    _onValueChange = (pickerValue=this.pickedValue,wheelIndex: number) => {
        this.props.onValueChange&&this.props.onValueChange(JSON.parse(JSON.stringify(pickerValue)), wheelIndex);
    }

    _updateSelectedIndex = (wheelIndex,valueIndex)=>{
        let wheelSelectedIndexes = this.state.wheelSelectedIndexes
            .slice(0,wheelIndex)
            .concat([parseInt(valueIndex+'')])
            .concat(this.state.wheelSelectedIndexes.slice(wheelIndex+1));
        this.setState({
            wheelSelectedIndexes: wheelSelectedIndexes
        });
        return wheelSelectedIndexes;
    }

    /**
     * 刷新wheel的数据和返回当前已选择的数据，针对级联数据
     * @oaram pickerData  总的级联数据
     * @param onInit 是否第一次初始化操作
     * @param pickedValueArray 已选择的结果，只有当onInit=true的时候会用到
     * @param wheelIndex 开始的wheel索引,onInit=true时默认为0；该值表示用户触发第几个wheel
     * @param valueIndex 触发的wheel的数组的选择值的索引
     * */
    _getCascadeData = (pickerData, onInit:boolean=false, pickedValueArray = [], wheelIndex= 0,valueIndex= 0 )=>{
        //不同wheel的数据数组
        let wheelDatas = [];
        let maxDeepLength = this.wheelSelectedIndexes.length;
        let wheelSelectedIndexes:Array<number> = Array.from({length: maxDeepLength});
        //该次数据的实际深度
        let validDeepLength = 1;
        let node = pickerData;
        for (let i=0;i< maxDeepLength;i++) {
            if(wheelIndex>0&&i<wheelIndex) {
                //保留所选择的wheelIndex，前面的wheel的数据和选中的索引不变
                wheelDatas[i] = this.state.wheelDatas[i];
                wheelSelectedIndexes[i] = this.state.wheelSelectedIndexes[i];
                if(node.constructor === Array) {
                    node = null;
                } else {
                    let keys = Object.keys(node);
                    //保留原有的值
                    node = this.state.wheelSelectedIndexes[i]>=0?node[keys[this.state.wheelSelectedIndexes[i]]]:null;
                }
                validDeepLength++;
                continue;
            }
            //说明已到末端
            if( node==null ) {
                break;
            }
            //只有当前这一级了
            if(node.constructor === Array) {
                wheelDatas[i] = [
                    ...node
                ];
                if (onInit) {
                    wheelSelectedIndexes[i] = node.findIndex(x=>x==pickedValueArray[i]);
                    if(wheelSelectedIndexes[i]<0) {
                        wheelSelectedIndexes[i] = 0;
                    }
                } else {
                    //默认选中第一个
                    if(i == wheelIndex) {
                        wheelSelectedIndexes[i] = valueIndex;
                    } else {
                        //如果该列中存在跟前面数据相同的值，则值不改变，譬如从4月30号变为5月30号
                        //则天数依旧保持在30号，而不是跳转到1号
                        let prevSelectedIndex = this.state.wheelSelectedIndexes[i];
                        if(prevSelectedIndex>=0
                            &&this.state.wheelDatas[i]!=undefined
                            &&wheelDatas[i]!=undefined
                            &&this.state.wheelDatas[i][prevSelectedIndex] == wheelDatas[i][prevSelectedIndex]) {
                            wheelSelectedIndexes[i] = prevSelectedIndex;
                        } else {
                            wheelSelectedIndexes[i] = 0;
                        }
                    }
                }
                node = null;
            } else {  //存在下一级
                //设置数据
                let keys = Object.keys(node);
                wheelDatas[i] = [
                    ...keys
                ];
                if(onInit) {
                    wheelSelectedIndexes[i] = keys.findIndex(x=>x==pickedValueArray[i]);
                    if(wheelSelectedIndexes[i]<0) {
                        wheelSelectedIndexes[i] = 0;
                    }
                } else {
                    //默认选中第一个
                    if(i == wheelIndex) {
                        wheelSelectedIndexes[i] = valueIndex;
                    } else {
                        //如果该列中存在跟前面数据相同的值，则值不改变，譬如从4月30号变为5月30号
                        //则天数依旧保持在30号，而不是跳转到1号
                        let prevSelectedIndex = this.state.wheelSelectedIndexes[i];
                        if(prevSelectedIndex>=0
                            &&this.state.wheelDatas[i]!=undefined
                            &&wheelDatas[i]!=undefined
                            &&this.state.wheelDatas[i][prevSelectedIndex] == wheelDatas[i][prevSelectedIndex]) {
                            wheelSelectedIndexes[i] = prevSelectedIndex;
                        } else {
                            wheelSelectedIndexes[i] = 0;
                        }
                    }
                }
                node = wheelSelectedIndexes[i]>=0?node[keys[wheelSelectedIndexes[i]+'']]:null;
            }
            //更新选中的索引值
            this._updateSelectedIndex(i,wheelSelectedIndexes[i]);
            validDeepLength++;
        }
        //计算选中的值
        let returnPickerData = Array.from({length:wheelSelectedIndexes.length},()=>[]);
        for (let i=0;i<wheelSelectedIndexes.length;i++) {
            //wheelDatas可能因为选中的值不对，没有数据
            returnPickerData[i] = wheelDatas[i]?wheelDatas[i][wheelSelectedIndexes[i]+''] : undefined;
        }
        this.setState({
            wheelDatas: wheelDatas,
            wheelSelectedIndexes: wheelSelectedIndexes,
        });
        return {
            wheelDatas,
            wheelSelectedIndexes: wheelSelectedIndexes,
            pickerData: returnPickerData
        };
    }

    _renderParallelWheel(pickerData){
        return pickerData.map((item, index) => {
            return (
                <View style={styles.pickerWheel} key={index}>
                    <Picker
                        selectedValue={this.state.wheelSelectedIndexes[index]}
                        onValueChange={valueIndex => {
                            this.pickedValue.splice(index, 1, pickerData[index][valueIndex]);
                            this._updateSelectedIndex(index, valueIndex);
                            this._onValueChange(this.pickedValue, index);
                        }} >
                        {item.map((value, itemIndex) => (
                            <PickerItem
                                key={itemIndex}
                                value={itemIndex}
                                label={value.toString()}
                            />)
                        )}
                    </Picker>
                </View>
            );
        });
    }

    _renderCascadeWheel(pickerData){
        return (
            <View style={[styles.pickerWrap]}>
                {
                    this.state.wheelDatas&&(this.state.wheelSelectedIndexes||[]).map((x,index)=>{
                        return (
                            <View key={index} style={styles.pickerWheel}>
                                <Picker
                                    ref={ref=>this.wheelRefs[index]=ref}
                                    selectedValue={this.state.wheelSelectedIndexes[index]}
                                    onValueChange={valueIndex => {
                                        let cascadeData = this._getCascadeData(pickerData, false, [],index,parseInt(valueIndex+''));
                                        //when onPicked, this.pickedValue will pass to the parent
                                        //when firstWheel changed, second and third will also change
                                        this.pickedValue = cascadeData.pickerData;
                                        this._onValueChange(cascadeData.pickerData, index);
                                    }} >
                                    {/*可能存在picker，但是数据为空*/}
                                    {(this.state.wheelDatas[index]||[]).map((value, index) => (
                                        <PickerItem
                                            key={index}
                                            value={index}
                                            label={value.toString()}
                                        />)
                                    )}
                                </Picker>
                            </View>
                        );
                    })
                }
            </View>
        );
    }

    _renderWheel(pickerData){
        let wheel = null;
        if(this.pickerStyle === 'parallel'){
            wheel = this._renderParallelWheel(pickerData);
        }
        else if(this.pickerStyle === 'cascade'){
            wheel = this._renderCascadeWheel(pickerData);
        }
        return wheel;
    }

    render(){
        return (
            <View style={[styles.pickerBox,{minHeight:240+(this.props.showHeader?40:0)}, this.props.style]}>
                {this.props.showHeader ?
                    <PickerHeader
                        {...this.props}
                        onPickerCancel={() => this._pickerCancel()}
                        onPickerConfirm={() => this._pickerConfirm()}
                    />
                    :
                    null
                }
                <View style={[styles.pickerWrap,this.props.pickerWrapperStyle]}>
                    {this._renderWheel(this.state.pickerData)}
                </View>
            </View>
        );
    }
}

let styles = StyleSheet.create({
    pickerBox: {
        // backgroundColor: '#bdc0c7',
        backgroundColor: 'white'
    },
    pickerWrap: {
        flexDirection: 'row',
        flex:1,
        alignItems:'center',
        minHeight:240,
    },
    pickerWheel: {
        flex: 1
    },
});
