# [0.2.0-beta18]() (2020-07-30)
* 将所有的componentWillReceiveProps换成componentDidUpdate中实现
* 移除DatePicker中的propTypes校验

# [0.2.0-beta17]() (2020-07-30)

* 修复DatePicker必须要设置默认值并且dateime模式下数据有问题的bug
* 修复DatePicker中onDateChange改为非必选
* 移除CommonPicker中的componentWillReceiveProps方法(~~项目react版本在16.3以下的使用该版本会报错~~)