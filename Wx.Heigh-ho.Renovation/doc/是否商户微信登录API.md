### 接口信息
#### 接口名：isSeller()
#### 接口描述：查询是否为商户微信登录

### 接口格式

#### 调用

```
接收方式        GET
```

```
接口地址：.../lpcs/home/Seller/isSeller
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
msg          true
)
```

```
失败
callback(
code          200
data          ""
msg           false
)
```

###### Code值含义

```
```