### 接口信息
#### 接口名：orderproduce()
#### 接口描述：确认付款

### 接口格式

#### 调用

```
接收方式        GET
```

```
接口地址：.../lpcs/home/order/orderproduce
```

###### Json数据格式
```
data
openid              微信用户id  
address_id          地址id
appointment_time    预约时间
distribution_cost   配送费
remark              订单备注

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
msg           信息不存在
)
```

###### Code值含义

```
```