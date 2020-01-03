import React, {FC} from "react";
import {StyleProp, Text, TextStyle, TouchableOpacity, View, ViewStyle} from "react-native";


export interface IProps {
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

const PickerHeader: FC<IProps> = ({pickerTitle,pickerCancelBtnText,
                                        pickerTitleStyle,
                                        pickerToolBarStyle,
                                        pickerCancelBtnStyle,
                                        pickerConfirmBtnStyle,
                                        pickerConfirmBtnText,onPickerCancel,onPickerConfirm})=>{
    return (
        <View style={[{flexDirection:'row',justifyContent:'space-between',height:40,
            borderBottomColor:'#e5e5e5',borderBottomWidth:0.7,backgroundColor:'#F4F4F3'},pickerToolBarStyle]}>
            <TouchableOpacity
                activeOpacity={0.9}
                style={[{paddingLeft:10,paddingRight:10,justifyContent:'center'},pickerCancelBtnStyle]}
                onPress={()=>{
                    onPickerCancel&&onPickerCancel();
                }}
            >
                <Text style={{color:'#666666',fontSize:16}}>{pickerCancelBtnText}</Text>
            </TouchableOpacity>
            <Text style={[{alignSelf:'center',color:'#000000',fontSize:16},pickerTitleStyle]}>{pickerTitle}</Text>
            <TouchableOpacity
                activeOpacity={0.9}
                style={[{paddingLeft:10,paddingRight:10,justifyContent:'center'},pickerConfirmBtnStyle]}
                onPress={()=>{
                    onPickerConfirm&&onPickerConfirm(null);
                }}
            >
                <Text style={{color:'#149be0',fontSize:16}}>{pickerConfirmBtnText}</Text>
            </TouchableOpacity>
        </View>
    );
};

PickerHeader.defaultProps = {
    pickerCancelBtnText: '取消',
    pickerConfirmBtnText: '确定',
};

export default PickerHeader;
