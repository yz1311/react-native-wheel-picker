# react-native-wheel-picker
[![npm version](http://img.shields.io/npm/v/@yz1311/react-native-wheel-picker.svg?style=flat-square)](https://npmjs.org/package/@yz1311/react-native-wheel-picker "View this project on npm")
[![npm version](http://img.shields.io/npm/dm/@yz1311/react-native-wheel-picker.svg?style=flat-square)](https://npmjs.org/package/@yz1311/react-native-wheel-picker "View this project on npm")

# 前言

该库最开始基于[react-native-wheel-picker](https://github.com/lesliesam/react-native-wheel-picker)，修改和拓展了很多功能

> android端基于[WheelPicker](https://github.com/AigeStudio/WheelPicker) 1.1.2版本(注意不要手动升级到1.1.3)进行封装

> ios端基于RN自带的PickerIOS进行封装

在原库的基础上面，进行了下面的修改:

* <span style="color: #006AB1;">修复几处严重bug，支持RN新版本</span>
* <span style="color: #006AB1;">添加typescript定义文件</span>
* <span style="color: #006AB1;">封装多Wheel支持(支持普通和级联模式)</span>
* <span style="color: #006AB1;">封装常用的DatePicker、RegionPicker、DateRangePicker组件</span>

由于两端均是原生组件，性能较好，所有的其他组件均是单个wheel在js端实现，后面bug修复可以直接修改js，方便热更新。


# 集成


```
npm i @yz1311/react-native-wheel-picker  moment --save
```

## 自动集成

RN>=0.60,由于auto linking，无需操作

RN<0.60

```
react-native link @yz1311/react-native-wheel-picker
```

## 手动集成

```
Add in settings.gradle 

include ':react-native-wheel-picker'
project(':react-native-wheel-picker').projectDir = new File(settingsDir, '../node_modules/@yz1311/react-native-wheel-picker/android')

Add in app/build.gradle

compile project(':react-native-wheel-picker')

Modify MainApplication

    import com.zyu.ReactNativeWheelPickerPackage;
    ......
    
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
            new MainReactPackage(), new ReactNativeWheelPickerPackage()
        );
    }
```

# 介绍
该库(>=0.2.0)提供了多种Picker，全部均是view，相比直接提供Modal+picker的模式，单纯的picker view更加灵活,想怎么组合都行

```javascript
import WheelPicker ,{CommonPicker,DateRangePicker,DatePicker,RegionPicker} from "@yz1311/react-native-wheel-picker";
```

## 基础Picker

* <font color='red'>WheelPicker</font>: 单个的wheel，是所有其他picker的基础控件，基于原生封装(iOS是RN自带的PickerIOS，android封装自`cn.aigestudio.wheelpicker:WheelPicker`)

* <font color='red'>CommonPicker</font>: 基于`WheelPicker`封装的多Wheel picker组件，支持`parallel`(wheel间不关联)和`cascade`(wheel间关联)两种模式,基本所有单、多wheel组件均可以直接使用该组件或者在该组件上封装


## 常用Picker

* <font color='red'>DatePicker</font>: 基于`CommonPicker`封装的日期选择组件，支持日期/时间/日期+时间 三种模式

* <font color='red'>DateRangePicker</font>: 基于`CommonPicker`封装的日期段选择组件，可以选择一个时间段

* <font color='red'>RegionPicker</font>: 基于`CommonPicker`封装的地址选择组件，支持选择省市区，封装了2019/01月的省市区数据，支持自定义数据源


各组件的属性，请查看[index.d.ts](./index.d.ts)

## 例子

引用
```
import WheelPicker ,{CommonPicker,DateRangePicker,DatePicker,RegionPicker} from "@yz1311/react-native-wheel-picker";
```

* ### 单wheel

```javascript
<CommonPicker
      pickerData={['刘备', '张飞', '关羽', '赵云', '黄忠', '马超', '魏延', '诸葛亮']}
      selectedValue={['']} />
```
![](https://tva1.sinaimg.cn/large/006tNbRwgy1ga6p3v0gwpj30bz082q33.jpg)


* ### 多wheel(parallel模式)

```javascript
<CommonPicker
        pickerData={[['男','女'],['0~20岁','21~40岁','40~60岁','60岁以上']]}
        selectedValue={['']} />
```
![](https://tva1.sinaimg.cn/large/006tNbRwgy1ga6p6tuax5j30bx0860sy.jpg)


* ### 多wheel(cascade模式)
  
```javascript
<CommonPicker
        pickerData={{
            '男': ['打游戏', '电子产品', '看球'],
            '女': ['买衣服', '买鞋子', '美妆', '自拍']
        }}
        selectedValue={['男','电子产品']} />
```
![](https://tva1.sinaimg.cn/large/006tNbRwgy1ga6pbbo92bj30c0085aa9.jpg)


* ### 日期选择(默认date模式，支持year/month/date/time/datetime)
注意: 不管是哪种模式，回调返回的数据都是一个date对象，具体的数值需要自己去转换

> `year:` 选择年份

> `month:` 选择年月

> `date:` 选择年月日

> `time:` 选择时分

> `datetime:` 选择年月日时分(minDate和maxDate无法影响到时分，只能影响到日期,譬如:minDate设置为2010-01-01 08:00:00,依旧可以选择当天00:00~23:59的时间段)

```
<DatePicker
        mode={'date'}
        //date值可以不填，默认是当前时间
        date={new Date()}
        onPickerConfirm={(value)=>{
            //不管mode的值是哪一种, value均是一个Date对象, 需要转换为所需的值
            //譬如: 如果mode=='year', 则可以通过`moment(value).year()`
        }}
        />
```
![](https://tva1.sinaimg.cn/large/006tNbRwgy1ga6pgdtf5aj30bx08474n.jpg)
![](https://tva1.sinaimg.cn/large/006tNbRwgy1ga6pfdoeusj30bw081jrh.jpg)
![](https://tva1.sinaimg.cn/large/006tNbRwgy1ga6pftwfmwj30bx082t98.jpg)

* ### 日期段选择

该库是仿照支付宝账单的时间段选择控件来的(支付宝: 我的-账单)


#### 规则介绍(跟支付宝的并非完全一样):

* 开始时间的选择范围: 当前时间的 前30年~后10年(跟DatePicker的范围一致)

* 结束时间的范围范围: 选择的开始时间~当前时间的后10年，也就是必须先选择开始时间才能选择结束时间

* 清空按钮，会设置开始时间为当前时间，结束时间为空

* 如果已选择开始结束时间，再将开始时间选择为大于结束时间，则会清空结束时间

* 通过startDate和endDate两个属性可以设置默认值(只能设置默认值，无法从外部更新值)

* 默认只有同时选择了开始结束时间才会返回值，其中有任意一个没选择，返回的startDate和endDate都是null 


```Javascript
<DateRangePicker
        //错误信息(可选)
        errorMessage={this.state.errorMessage}
        onPickerConfirm={(startDate, endDate)=>{
            //注意: startDate和endDate是Date对象, 但是均可能为null
            //如果有需求，必须同时选择开始结束时间的，可以通过判断这两个值是否为空来控制后续操作(譬如不让用户关闭Modal)
        }
       />
```

![](https://tva1.sinaimg.cn/large/006tNbRwgy1ga6pq1oyjhj30by0ay3yu.jpg)

* ### 地址选择

项目的数据来自于[Administrative-divisions-of-China](https://github.com/modood/Administrative-divisions-of-China) 的 [pca-code.json](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/pca-code.json),

项目里面已经自带该数据源，也可以用`data={require('pca-code.json')}`的方式自定义数据源，但必须符合格式

如果需要二级、四级、五级等其它联动模式，可以直接按照[RegionPicker](https://github.com/yz1311/react-native-wheel-picker/blob/master/src/RegionPicker.tsx)改写一下就行了(或者提issues我加上)

```javascript
<RegionPicker
        //模式，'p' | 'pc' | 'pca'三个值分别代表省、省市、省市区 三种模式,默认是pca
        mode="pca"
        onPickerConfirm={(names, codes)=>{
            //names: ["上海市", "市辖区", "黄浦区"],根据mode的不同返回不同长度的数组
            //codes: ["31", "3101", "310101"],根据mode的不同返回不同长度的数组
        }}
        selectedValue={['']} />
```

![](https://tva1.sinaimg.cn/large/006tNbRwgy1ga6pskjshtj30c0084aaj.jpg)


* ### 结合Modal使用
大部分情况下Picker都不是只作为view使用，而是底部弹窗选择，下面是[react-native-modal](https://github.com/react-native-community/react-native-modal)为例的代码:

```javascript
    <Modal
        style={{flex:1, justifyContent:'flex-end',margin: 0}}
        isVisible={selectDateVisible}
        onBackdropPress={()=>{
            setSelectDateVisible(false);
        }}
        onBackButtonPress={()=>{
            setSelectDateVisible(false);
        }}
        >
        //所有的picker是默认显示header的
        <DatePicker
            pickerTitle='预约时间'
            date={ruleForm.appointmentTime}
            mode={'datetime'}
            onPickerCancel={()=>{
                setSelectDateVisible(false);
            }}
            onPickerConfirm={date=>{
                setRuleForm(prevState => ({
                    ...prevState,
                    appointmentTime: date
                }));
                setSelectDateVisible(false);
            }}
            //大部分情况下不用关注date改变时的数据，下面方法可以删除
            onDateChange={()=>{}}
        />
    </Modal>
```


## 开发计划

+ [ ] CommonPicker支持传入对象数组而不是仅仅纯string/number数组
+ [x] ~~RegionPicker添加省市选择模式~~
+ [ ] 所有的Picker增加自带Modal模式,并支持ref的方式调用，减少代码量



## 截图(android/iOS)

### datePicker

![](https://tva1.sinaimg.cn/large/006tNbRwgy1ga6o9nw0lxj30u01uo762.jpg)
![](https://tva1.sinaimg.cn/large/006tNbRwgy1ga6o9xu78pj30c00lx3za.jpg)


### dateRangePicker

![](https://tva1.sinaimg.cn/large/006tNbRwgy1ga6ob3ycfcj30u01uomzf.jpg)
![](https://tva1.sinaimg.cn/large/006tNbRwgy1ga6obajcubj30c00lxaau.jpg)

### regionPicker

![](https://tva1.sinaimg.cn/large/006tNbRwgy1ga6obnr8ykj30u01uowgk.jpg)
![](https://tva1.sinaimg.cn/large/006tNbRwgy1ga6obrmhndj30c00lxaaq.jpg)