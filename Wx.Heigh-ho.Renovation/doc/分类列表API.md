### 接口信息
#### 接口名：catelist()
#### 接口描述：获取导航分类列表信息

### 接口格式

#### 调用

```
接收方式        GET
```

```
接口地址：.../lpcs/home/category/catelist
```

###### Json数据格式
```
data

callback            回调
```

#### 回调
###### Json数据格式

```
成功
callback(
code         000
data         {
                    cate_id                分类id
                    cate_name              分类名称
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