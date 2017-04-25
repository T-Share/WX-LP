### 接口信息
#### 接口名：del()
#### 接口描述：删除地址

### 接口格式

#### 调用

```
接收方式        GET
```

```
接口地址：.../lpcs/home/address/del
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