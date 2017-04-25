### 接口信息
#### 接口名：queryDeliverFee()
#### 接口描述：查询订单配送费接口

### 接口格式

#### 调用

```
接收方式        POST
```

```
接口地址：.../lpcs/home/dada/queryDeliverFee
```

###### Json数据格式
```
data
openid              微信用户id
address_id          地址id

callback            回调
```

#### 回调
###### Json数据格式

```
成功
callback(
code         000
data         {
                    status { 
                                 quantity         购物车总商品数量
                                 amount           购物车总金额
                            }
                    carts   {
                                 goods_id         商品id
                                 goods_name       商品名称
                                 price            销售价
                                 discount_price   折扣价
                                 unit             单位
                                 goods_num        商品数量
                            }
                    fee                           运费(单位：元)
             }
msg          ""
)
```

```
失败
callback(
code          111
data          ""
msg           达达接口返回码描述
)
```

###### Code值含义

```
222           请求异常      
```