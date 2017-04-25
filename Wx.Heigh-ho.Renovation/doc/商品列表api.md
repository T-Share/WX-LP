### 接口信息
#### 接口名：goodslist()
#### 接口描述：获取商品列表信息

### 接口格式

#### 调用

```
接收方式        GET
```

```
接口地址：.../lpcs/home/goodslist/goodslist
```

###### Json数据格式
```
data
cate_id             一级分类id
openid              微信用户id

callback            回调
```

#### 回调
###### Json数据格式

```
成功
callback(
code         000
data         {
                    
                    cate_id                          二级分类id
                    cate_name                        二级分类名称
                    goods {
                                goods_id             商品id
                                goods_name           商品名称
                                cate_id              二级分类id
                                goods_img            商品图片
                                price                销售价
                                unit                 单位
                                discount_price       折扣价
                                tag                  标签  
                                goods_num            购物车商品数量
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