### 接口信息
#### 接口名：index()
#### 接口描述：获取用户信息

### 接口格式

#### 调用

```
接收方式        GET
```

```
接口地址：.../lpcs/home/index/index
```

###### Json数据格式
```
data
code                微信回调拿到的code

callback            回调
```

#### 回调
###### Json数据格式

```
成功
callback(
code         000
data         {
                    
                    openid                           微信用户openid
                    nickname                         微信用户昵称
                    sex                              微信用户性别
                    headimg                          微信用户头像
             }
msg          ""
)
```

```
失败
callback(
code          111
data          ""
msg           ""
)
```

###### Code值含义

```
```