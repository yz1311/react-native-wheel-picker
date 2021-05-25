/**
 * 省市区选择组件
 */

import React, {forwardRef, PureComponent} from "react";
import CommonPicker from "./CommonPicker";
import pca from './resource/pca-code.json';
import pc from './resource/pc-code.json';
import {IRegionPickerProps as IProps} from '../types';


export interface IState {
    pickerData: any,
}

export default class RegionPicker extends PureComponent<IProps,IState>{

    static defaultProps = {
        //不需要props中的pickerData了
        pickerData: null,
        mode: 'pca'
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
        let source = this.props.data;
        switch (this.props.mode) {
          case "p":
            if(!source) {
               source = pc;
            }
            pickerData = [];
            for (let province of source) {
              pickerData.push(province.name);
            }
            break;
          case "pc":
            if(!source) {
               source = pc;
            }
            for (let province of source) {
              pickerData[province.name] = (province.children||[]).map(x=>x.name);
            }
            break;
          case "pca":
            if(!source) {
               source = pca;
            }
            for (let province of source) {
              pickerData[province.name] = {};
              if(province.children&&province.children.length>0) {
                for (let city of province.children) {
                  pickerData[province.name][city.name] = (city.children || []).map(x=>x.name);
                }
              }
            }
            break;
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
              if(value[1]!=undefined) {
                city = (province.children || []).find(x=>x.name==value[1]);
              }
              if(city&&value[2]!=undefined) {
                area = (city.children || []).find(x=>x.name==value[2]);
              }
            }
            switch (this.props.mode) {
              case "p":
                codes = [province?.code];
                break;
              case "pc":
                codes = [province?.code,city?.code];
                break;
              case "pca":
                codes = [province?.code,city?.code,area?.code];
                break;

            }
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
