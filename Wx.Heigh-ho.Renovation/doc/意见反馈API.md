### 接口信息
#### 接口名：add()
#### 接口描述：意见反馈发表信息

### 接口格式

#### 调用

```
接收方式        GET/POST
```

```
接口地址：.../lpcs/home/suggestion/add
```

###### Json数据格式
```
data
openid              微信用户id  
order_id            订单id
content             内容

callback            回调
```

#### 回调
###### Json数据格式

```
成功
callback(
code         000
data         ""
msg          发表成功
)
```

```
失败
callback(
code          111
data          ""
msg           发表失败
)
```

###### Code值含义

```
```