### 接口信息
#### 接口名：add()
#### 接口描述：把商品加入购物车

### 接口格式

#### 调用

```
接收方式        POST
```

```
接口地址：.../lpcs/home/cart/add
```

###### Json数据格式
```
data
openid              微信用户id
goods_id            商品id

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
             }
msg          ""
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
#### 接口名：del()
#### 接口描述：将商品从购物车删除

### 接口格式

#### 调用

```
接收方式        POST
```

```
接口地址：.../lpcs/home/cart/del
```

###### Json数据格式
```
data
openid              微信用户id
goods_id            商品id

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
             }
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
112           购物车没有该商品
```
#### 接口名：emptycart()
#### 接口描述：清空购物车

### 接口格式

#### 调用

```
接收方式        POST
```

```
接口地址：.../lpcs/home/cart/emptycart
```

###### Json数据格式
```
data
openid              微信用户id

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