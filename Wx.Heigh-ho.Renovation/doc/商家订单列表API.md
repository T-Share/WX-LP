### 接口信息
#### 接口名：orderlist()
#### 接口描述：商家订单列表信息

### 接口格式

#### 调用

```
接收方式        GET/POST
```

```
接口地址：.../lpcs/home/seller/orderlist
```

###### Json数据格式
```
data

callback            回调
```

#### 回调
###### Json数据格式

```
成功
callback(
code         000
data         {
                    name             姓名
                    phone            联系方式
                    order_id         订单id 
                    order_step       订单步骤 1：已支付待接单 2：待配送 3：已完成 5：配送中
                    order_step_ch    订单步骤中文
                    order_time       下单时间
                    goods_num        购买数量
                    total_amount     消费金额
             }
msg          ""
)
```

```
失败
callback(
code          111
data          ""
msg           查询失败
)
```

###### Code值含义

```
```