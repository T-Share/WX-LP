### 接口信息
#### 接口名：order_continue()
#### 接口描述：待付款的订单去付款

### 接口格式

#### 调用

```
接收方式        GET/POST
```

```
接口地址：.../lpcs/home/order/order_continue
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
data         {
                    jsApiParameters   微信下单请求参数
                    order_id          订单id
             }
msg          ""
)
```

```
失败
callback(
code          111
data          ""
msg           订单不存在 
)
```

###### Code值含义

```
112            该订单已支付
```