### 接口信息
#### 接口名：add()
#### 接口描述：添加地址信息

### 接口格式

#### 调用

```
接收方式        POST
```

```
接口地址：.../lpcs/home/address/add
```

###### Json数据格式
```
data
openid              用户openid
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
msg          添加成功
)
```

```
失败
callback(
code          111
data          ""
msg           添加失败
)
```

###### Code值含义

```
```