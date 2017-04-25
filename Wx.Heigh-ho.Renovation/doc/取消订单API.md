### 接口信息
#### 接口名：ordercancel()
#### 接口描述：意见反馈发表信息

### 接口格式

#### 调用

```
接收方式        GET/POST
```

```
接口地址：.../lpcs/home/order/ordercancel
```

###### Json数据格式
```
data
order_id            订单id

callback            回调
```

#### 回调
###### Json数据格式

```
成功
callback(
code         000
data         ""
msg          取消成功
)
```

```
失败
callback(
code          111
data          ""
msg           取消失败
)
```

###### Code值含义

```
112            该订单不能取消
```