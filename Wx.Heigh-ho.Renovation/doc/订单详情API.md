### 接口信息
#### 接口名：orderinfo()
#### 接口描述：订单详情信息

### 接口格式

#### 调用

```
接收方式        GET/POST
```

```
接口地址：.../lpcs/home/order/orderinfo
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
                    name                 姓名
                    phone                联系方式
                    area                 小区/大厦/学校
                    address              详细地址
                    room                 门牌号
                    order_id             订单id 
                    order_step           订单步骤 0:待支付 1：已支付待接单 2：待配送 3：已完成 4：已取消
                    order_step_ch        订单步骤中文
                    order_time           下单时间
                    goods_num            购买商品总数量
                    goods_amount         购买商品总金额
                    distribution_cost    配送费
                    total_amount         消费总金额
                    pay_time             支付完成时间
                    receiving_time       接单时间
                    finish_time          完成时间
                    appointment_time     订单预约时间
                    remark               订单备注
                    goods {
                               goods_id             商品id
                               goods_name           商品名
                               goods_img            商品图片
                               price                商品销售价
                               discount_price       商品折扣价
                               goods_num            购买商品数量
                          }
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