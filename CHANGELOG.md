

# [0.4.4]() (2025-03-07)

* 修复release后闪退的问题
* 增加对New Architecture的支持

> 注意，android/app/build.gradle中需要添加
```
dependencies {
    implementation fileTree(dir: '../../node_modules/@yz1311/react-native-wheel-picker/android/libs', include: ['*.aar'])
}
```

# [0.4.2]() (2022-09-30)

* 修复对RN0.69+的支持

# [0.4.1]() (2022-05-24)

* 支持react-native-web (@[yatessss](https://github.com/yatessss))

# [0.3.9]() (2021-10-27)

* 暴露indicator、indicatorColor两个属性，完成 [#43](https://github.com/yz1311/react-native-wheel-picker/issues/43)

# [0.3.8]() (2021-09-01)

* 修复DatePicker和DateRangePicker没有继承CommonPicker相关属性的问题

# [0.3.7]() (2021-09-01)

~~* 修复DatePicker和DateRangePicker没有继承CommonPicker相关属性的问题~~

# [0.3.6]() (2021-08-31)

* 修复itemStyle android下选中颜色设置无效的问题[#31](https://github.com/yz1311/react-native-wheel-picker/issues/31) 


# [0.3.5]() (2021-07-05)

* 修复itemStyle属性没有传递给picker[#29](https://github.com/yz1311/react-native-wheel-picker/issues/29) ([75cedbdd07](https://github.com/yz1311/react-native-wheel-picker/commit/75cedbdd077ee2b057e9c1857ad6d2528aaf553d) by [songhlc](https://github.com/yz1311/react-native-wheel-picker/commits?author=songhlc))


# [0.3.4]() (2021-05-27)

<font color=red>该版本更改了android原生，需要重新打包更新，但无破坏性更新</font>

* 修复部分手机默认选中状态错误的问题[#27](https://github.com/yz1311/react-native-wheel-picker/issues/27)

# [0.3.3]() (2021-05-25)
原本以为[Administrative-divisions-of-China](https://github.com/modood/Administrative-divisions-of-China)
的省市数据可以直接从省市区中拆分出来，但是发现该库其实对省市进行了单独的处理，譬如在pca中，
仙桃市是湖北省-省直辖县级行政区划-仙桃市，而pc中是湖北省-仙桃市，所以还是有必要单独使用pc的数据

<font color=red>该处升级可能会对已保存的数据产生影响(只针对使用pc模式)</font>

* 将RegionPicker的pc模式的数据源改为单独的文件
* CommonPicker添加wheelStyles属性，加大DatePicker mode=datetime时年份的宽度

# [0.3.2]() (2021-04-02)
* 彻底解决PickerIOS的警告问题，并兼容老的RN版本

# [0.3.1]() (2021-03-30)
* 兼容iphone12 max和mini

# [0.3.0]() (2021-03-23)
##Breaking Changes
* 因为PickerIOS组件即将在新版的react-native中移除掉，而`@react-native-picker/picker`库中只需要PickerIOS组件，
  将`@react-native-picker/picker`中ios部分的代码放在项目中 (解决 [#16](https://github.com/yz1311/react-native-wheel-picker/issues/16) [#18](https://github.com/yz1311/react-native-wheel-picker/issues/18))
  
从0.3.0版本开始，安装库之后，需要在`ios`文件夹执行
```
pod install
```


# [0.2.7]() (2021-03-23)
* 支持弹窗模式(注意: 需要安装`react-native-modal`库)
* 统一定义文件,修复部分ts定义

# [0.2.5]() (2020-10-18)
* `RegionPicker`组件新增mode属性，'p'|'pc'|'pca'(省、省市、省市区)三种模式
* 完善index.d.ts文件

# [0.2.4]() (2020-10-16)
* `PickerHeader`组件(所有Picker公用的头部组件)支持`取消`和`确定`按钮的自定义样式
* 完善index.d.ts文件

# [0.2.3]() (2020-09-15)
* 修复并完善`DateRangePicker`组件及文档,修复[#9](https://github.com/yz1311/react-native-wheel-picker/issues/9)

# [0.2.2]() (2020-09-07)
* 移除不必要的`create-react-class`库，修复[#7](https://github.com/yz1311/react-native-wheel-picker/issues/7)

# [0.2.1]() (2020-08-28)(<font color="red">不要使用该版本，有严重bug</font>)
* 修复`DatePicker`对年份和月份处理有误
* `DatePicker`添加对错误参数的兼容处理 
* 修复`DatePicker`的ts定义

# [0.2.0]() (2020-08-27)
* 重写`DatePicker`组件，底层实现从`cascade`模式改为`parallel`模式，性能有了很大提升,有些默认行为发生了变化
  
> 1.minDate的默认值为改为当前日期的前30年(前面是10年)和后10年

> 2.在切换日期的时候，重置日期有一直默认为第一个变为动态改变
    譬如从2020-08-31滑动到2月份，会引起日期的重置，变为0-28,此时改为默认选中28号;如果是因为最小值和最大值引起的重置，则默认选中第一个

# [0.2.0-beta18]() (2020-07-30)
* 将所有的`componentWillReceiveProps`换成`componentDidUpdate`中实现
* 移除`DatePicker中`的propTypes校验

# [0.2.0-beta17]() (2020-07-30)

* 修复`DatePicker`必须要设置默认值并且dateime模式下数据有问题的bug
* 修复`DatePicker`中onDateChange改为非必选
* 移除`CommonPicker`中的componentWillReceiveProps方法(~~项目react版本在16.3以下的使用该版本会报错~~)
