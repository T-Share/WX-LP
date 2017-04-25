### 接口信息
#### 接口名：todayrecommend()
#### 接口描述：获取今日推荐商品列表信息

### 接口格式

#### 调用

```
接收方式        GET
```

```
接口地址：.../lpcs/home/goodslist/todayrecommend
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
data         {
                    goods_id                商品id
                    goods_name              商品名称
                    goods_img               商品图片
                    price                   商品售价
                    unit                    商品单位
                    discount_price          商品折扣价
                    goods_num               购物车商品数量
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