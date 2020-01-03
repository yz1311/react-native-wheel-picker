/**
 * 省市区选择组件
 */

import React, {forwardRef, PureComponent} from "react";
import CommonPicker,{IProps as ICommonPickerProps} from "./CommonPicker";
import {View} from "react-native";
import pca from './resource/pca-code.json';

//@ts-ignore
export interface IProps extends ICommonPickerProps{
    //传递自定义的json文件
    data?:any,
    onPickerConfirm:(names:Array<string>,codes:Array<string>)=>void,
}

export interface IState {
    pickerData: any,
}

export default class RegionPicker extends PureComponent<IProps,IState>{

    static defaultProps = {
        //不需要props中的pickerData了
        pickerData: null
    };

    readonly state:IState = {
        pickerData: null,
    };

    constructor(props:IProps) {
        super(props);
    }

    componentDidMount(): void {
        let pickerData:any = {};
        //支持外部源
        let source = this.props.data || pca;
        for (let province of source) {
            pickerData[province.name] = {};
            if(province.children&&province.children.length>0) {
                for (let city of province.children) {
                    pickerData[province.name][city.name] = (city.children || []).map(x=>x.name);
                }
            }
        }
        this.setState({
            pickerData: pickerData
        })
    }

    _onPickerConfirm = (value)=>{
        //解析出省市区的code
        let codes = [];
        let source = this.props.data || pca;
        if(source) {
            let province,city,area;
            province = source.find(x=>x.name==value[0]);
            if(province) {
                city = (province.children || []).find(x=>x.name==value[1]);
                if(city) {
                    area = (city.children || []).find(x=>x.name==value[2]);
                }
            }
            codes = [province?.code,city?.code,area?.code];
        }

        this.props.onPickerConfirm&&this.props.onPickerConfirm(value, codes);
    }

    render () {
        return (
            <CommonPicker
                    {...this.props}
                    onPickerConfirm={(value)=>this._onPickerConfirm(value)}
                    pickerData={this.state.pickerData}>
            </CommonPicker>
        );
    }
}
