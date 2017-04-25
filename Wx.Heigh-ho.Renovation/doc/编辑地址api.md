### 接口信息
#### 接口名：addressinfo()
#### 接口描述：编辑地址信息的详情展示

### 接口格式

#### 调用

```
接收方式        GET
```

```
接口地址：.../lpcs/home/address/addressinfo
```

###### Json数据格式
```
data
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
                    address_id          地址id
                    name                姓名
                    sex                 性别
                    phone               手机
                    area                小区/大厦/学校
                    address             详细地址
                    room                门牌号
                    receiver_lat        地址维度（高德坐标系）
                    receiver_lng        地址经度（高德坐标系）
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
#### 接口名：edit()
#### 接口描述：提交编辑地址信息

### 接口格式

#### 调用

```
接收方式        POST
```

```
接口地址：.../lpcs/home/address/edit
```

###### Json数据格式
```
data
address_id          地址id
name                姓名
sex                 性别
phone               手机
area                小区/大厦/学校
address             详细地址
room                门牌号
receiver_lat        地址维度（高德坐标系）
receiver_lng        地址经度（高德坐标系）

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