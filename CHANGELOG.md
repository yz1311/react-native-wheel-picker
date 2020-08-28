# [0.2.1]() (2020-08-28)
* 修复DatePicker对年份和月份处理有误
* DatePicker添加对错误参数的兼容处理 
* 修复DatePicker的ts定义

# [0.2.0]() (2020-08-27)
* 重写DatePicker组件，底层实现从cascade模式改为parallel模式，性能有了很大提升,有些默认行为发生了变化
  
> 1.minDate的默认值为改为当前日期的前30年(前面是10年)和后10年

> 2.在切换日期的时候，重置日期有一直默认为第一个变为动态改变
    譬如从2020-08-31滑动到2月份，会引起日期的重置，变为0-28,此时改为默认选中28号;如果是因为最小值和最大值引起的重置，则默认选中第一个

# [0.2.0-beta18]() (2020-07-30)
* 将所有的componentWillReceiveProps换成componentDidUpdate中实现
* 移除DatePicker中的propTypes校验

# [0.2.0-beta17]() (2020-07-30)

* 修复DatePicker必须要设置默认值并且dateime模式下数据有问题的bug
* 修复DatePicker中onDateChange改为非必选
* 移除CommonPicker中的componentWillReceiveProps方法(~~项目react版本在16.3以下的使用该版本会报错~~)