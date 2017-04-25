### 接口信息
#### 接口名：order_confirm()
#### 接口描述：商家确认接单

### 接口格式

#### 调用

```
接收方式        GET/POST
```

```
接口地址：.../lpcs/home/seller/order_confirm
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
msg          成功
)
```

```
失败
callback(
code          111
data          ""
msg           失败
)
```

###### Code值含义

```
112           该订单不是在接单状态
```