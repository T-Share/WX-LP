### 接口信息
#### 接口名：index()
#### 接口描述：地址列表信息

### 接口格式

#### 调用

```
接收方式        GET
```

```
接口地址：.../lpcs/home/address/index
```

###### Json数据格式
```
data
openid              用户openid

callback            回调
```

#### 回调
###### Json数据格式

```
成功
callback(
code         000
data         {
                    address_id      地址id
                    name            姓名
                    phone           手机
                    area            
                    address
                    room
                    is_default      是否默认地址
                    over            是否超出配送范围 1：超出配送范围 0：未超出
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
### 接口信息
#### 接口名：notover()
#### 接口描述：没有超出配送范围的地址列表信息

### 接口格式

#### 调用

```
接收方式        GET/POST
```

```
接口地址：.../lpcs/home/address/notover
```

###### Json数据格式
```
data
openid              用户openid

callback            回调
```

#### 回调
###### Json数据格式

```
成功
callback(
code         000
data         {
                    address_id      地址id
                    name            姓名
                    phone           手机
                    area            
                    address
                    room
                    is_default      是否默认地址
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
112           未添加收货地址
```