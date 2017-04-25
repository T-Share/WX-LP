### 接口信息
#### 接口名：order_del()
#### 接口描述：删除订单

### 接口格式

#### 调用

```
接收方式        GET
```

```
接口地址：.../lpcs/home/order/order_del
```

###### Json数据格式
```
data
order_id            订单id
如果是商家端订单列表的删除 多传个type=2

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
```