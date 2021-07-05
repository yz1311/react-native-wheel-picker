/**
 * 注意点:
 * 1.需要保证每一列的数据不会有重复的(重复了也会兼容)
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
//@ts-ignore
import WheelCurvedPicker from '../WheelCurvedPicker';
import PickerHeader from './PickerHeader';
import {ICommonPickerProps as IProps} from '../types';
import {isIPhoneX} from './utils';

const Picker = WheelCurvedPicker;
let PickerItem = Picker.Item;


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
        wheelStyles: [],
        pickerConfirmBtnText: '确定',
        pickerCancelBtnText: '取消',
        selectedValue: []
    };

    private pickerStyle: 'parallel' | 'cascade';
    private pickedValue: any;
    private wheelRefs:Array<any> = [];
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

    UNSAFE_componentWillReceiveProps(newProps: Readonly<IProps>, nextContext: any): void {
        let newState = this._getStateFromProps(newProps);
        this.setState(newState,()=>{
            if(this.pickerStyle == 'cascade') {
                //@ts-ignore
                this._getCascadeData(newProps.pickerData,true, newProps.selectedValue);
            }
        });
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
        let { pickerData, selectedValue:tempSelectedValue } = props;
        //兼容错误数据,并且让picker能展示出来
        if (pickerData == undefined || Object.keys(pickerData).length == 0 || pickerData.length == 0) {
            pickerData = [['']];
        }
        //compatible single wheel sence
        let selectedValue = [];
        if (tempSelectedValue && tempSelectedValue.constructor !== Array) {
            selectedValue = [tempSelectedValue];
        } else {
            selectedValue = [...tempSelectedValue];
        }
        let pickerStyle = pickerData.constructor === Array ? 'parallel' : 'cascade';
        let wheelSelectedIndexes;
        let cascadeData = {wheelDatas: undefined};
        if (pickerStyle === 'parallel') {
            wheelSelectedIndexes = Array.from({ length: pickerData.length });
            //是否是单列数据
            let isSingleWheel = false;
            //格式化数据
            if(!pickerData.some(x => Array.isArray(x))) {
                //全部不是数组
                //说明是['1','2','3']这种单列数据

                //设置默认选中值必须要在pickerData重新赋值之前
                //默认取第一个元素
                let index = 0
                wheelSelectedIndexes[index] = 0;
                //只会取第一个值，多的值会被忽略
                let findIndex = pickerData.findIndex(x => x == selectedValue[0]);
                if (findIndex > 0) {
                    wheelSelectedIndexes[index] = findIndex;
                }
                selectedValue[index] = pickerData[wheelSelectedIndexes[index]];
                pickerData = [pickerData];
                isSingleWheel = true;
            } else {   //正常的多列数据
                //检查是否有非数组
                if(pickerData.some(x=>!Array.isArray(x))) {
                    console.warn('parallel模式，数组内部要么全部数组，要么全部字符串/数字');
                    //如有有，则将非数组全部转换为数组
                    pickerData = pickerData.map(x=>{
                        if(Array.isArray(x)) {
                            return x;
                        }
                        return [x];
                    });
                }
                //设置默认值
                for (let index in pickerData) {
                    let wheelData = pickerData[index];
                    //默认取第一个元素
                    wheelSelectedIndexes[index] = 0;
                    let findIndex = wheelData.findIndex(x => x == selectedValue[index]);
                    if (findIndex > 0) {
                        wheelSelectedIndexes[index] = findIndex;
                    }
                    selectedValue[index] = wheelData[wheelSelectedIndexes[index]];
                }
            }

            this.wheelSelectedIndexes = wheelSelectedIndexes;
            //console.log(wheelSelectedIndexes)
        } else if (pickerStyle === 'cascade') {
            //找出级别
            let maxDeepLength = this._getDeepLength(pickerData, 0);
            wheelSelectedIndexes = Array.from({ length: maxDeepLength });
            this.wheelSelectedIndexes = wheelSelectedIndexes;
        }
        //save picked data
        this.pickedValue = JSON.parse(JSON.stringify(selectedValue));
        this.pickerStyle = pickerStyle as 'parallel' | 'cascade';
        let result = Object.assign(Object.assign({}, props), { pickerData,
            selectedValue, wheelDatas: cascadeData.wheelDatas, wheelSelectedIndexes: wheelSelectedIndexes });
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
        this.pickedValue = returnPickerData;
        return {
            wheelDatas,
            wheelSelectedIndexes: wheelSelectedIndexes,
            pickerData: returnPickerData
        };
    }

    _renderParallelWheel(pickerData){
        return pickerData.map((item, index) => {
            const wheelStyle = (this.props.wheelStyles || [])[index] || {};
            return (
                <View key={index} style={[styles.pickerWheel, wheelStyle]}>
                    <Picker
                        selectedValue={this.state.wheelSelectedIndexes[index]}
                        itemStyle={this.props.itemStyle}
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
                        const wheelStyle = (this.props.wheelStyles || [])[index] || {};
                        return (
                            <View key={index} style={[styles.pickerWheel, wheelStyle]}>
                                <Picker
                                    ref={ref=>this.wheelRefs[index]=ref}
                                    selectedValue={this.state.wheelSelectedIndexes[index]}
                                    itemStyle={this.props.itemStyle}
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
        const {isModal, modalProps, modalVisible, onModalVisibleChange} = this.props;
        const pickerView = (
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
                {isModal&&isIPhoneX?<View style={{height: 34}}/> : null}
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
