### 接口信息
#### 接口名：setdefault()
#### 接口描述：设置默认地址

### 接口格式

#### 调用

```
接收方式        POST
```

```
接口地址：.../lpcs/home/address/setdefault
```

###### Json数据格式
```
data
openid              用户openid
address_id          地址id

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