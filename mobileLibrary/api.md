
1. 登录接口
	--------

	- **接口地址 http://ip:port/user/login**

    - **请求方法:POST**

    - **请求参数**

        参数名称 | 必需 | 类型   | 描述
        ------------|------|--------|--------------
        loginNum    | 是   | string | 用户学号
        loginPsd    | 是   | string | 用户登录密码

    - **响应参数**

        参数名称 | 必需 | 类型   | 描述
        ------------|------|---------|----------------
        status      | 是   | boolean | 判断相应状态
        name        | 是   | string  | 用户昵称
        accountnum  | 是   | string  | 登录学号
        role        | 是   | string  | 用户权限
        msg         | 是   | string  | 返回的信息


    1. 登录成功返回的数据
    ```json
    {
        "status": true,
        "name": "admin",
        "accountnum": "12345",
        "role": "100",
        "msg": "登录成功！"
    }
    ```

    2. 登录失败返回的数据
    ```json
    {
        "status": false,
        "msg": "密码错误"
    }
    {
        "status": false,
        "msg": "用户不存在"
    }
    ```

2. 登出接口
	--------

	- **接口地址 http://ip:port/user/signout**

    - **请求方法:POST**

    - **请求参数**

        无


    - **响应参数**

        参数名称 | 必需 | 类型   | 描述
        ------------|------|---------|----------------
        status      | 是   | boolean | 判断相应状态
        msg         | 是   | string  | 返回的信息


    1. 成功返回的数据
    ```json
    {
        "status": true,
        "msg": "登出成功！"
    }
    ```
3. 根据学号查询个人信息
	--------

	- **接口地址 http://ip:port/user/userinfo/:usernum**

    - **请求方法:GET**

    - **请求参数**

        参数名称 | 必需 | 类型   | 描述
        ------------|------|--------|--------------
        usernum     | 是   | string | 用户学号

    - **响应参数**

        参数名称 | 必需 | 类型   | 描述
        ----------------|------|---------|----------------
        status          | 是   | boolean | 判断相应状态
        userid          | 是   | string  | 用户学号
        username        | 是   | string  | 用户昵称
        usersex         | 是   | string  | 用户性别
        userrole        | 是   | string  | 用户权限
        userLearnTime   | 是   | string  | 学习时长总计
        userExp         | 是   | string  | 经验
        userAction      | 是   | string  | 关注
        userFans        | 是   | string  | 粉丝数
        userCon         | 是   | string  | 积分


    1. 成功返回的数据


    2. 失败返回的数据
    ```json
    {
        "status": false,
        "msg": "无用户数据"
    }
    ```
4. 用户修改自己密码
	--------

	- **接口地址 http://ip:port/user/update/pwd**

    - **请求方法:POST**

    - **请求参数**

        参数名称 | 必需 | 类型   | 描述
        ------------|------|--------|--------------
        userId         | 是   | string | 用户学号
        userLastPass   | 是   | string | 用户旧密码
        userNewPass    | 是   | string | 用户新密码

        

    - **响应参数**

        参数名称 | 必需 | 类型   | 描述
        ------------|------|---------|----------------
        status      | 是   | boolean | 判断相应状态  
        msg         | 是   | string  | 返回的信息


    1. 成功返回的数据
    ```json
    {
        status: true,
        msg: '密码更新成功'
    }
    ```

    2. 失败返回的数据
    ```json
    {
        "status": false,
        "msg": "无用户数据"
    }
    ```
5. 搜索图书
	--------

	- **接口地址 http://ip:port/file/search?bookname=**

    - **请求方法: GET**

    - **请求参数**

        参数名称 | 必需 | 类型   | 描述
        ------------|------|---------|----------------
        status      | 是   | boolean | 判断状态信息


    - **响应参数**

        参数名称 | 必需 | 类型   | 描述
        ------------|------|---------|----------------
        status      | 是   | boolean | 判断状态信息
        searchRes   | 是   | Object  | 评论信息
        msg         | 是   | string  | 信息

        * searchRes

            参数名称 | 必需 | 类型   | 描述
            ------------|------|---------|----------------
            __id        | 是   | string | 图书 id               
            bookName    | 是   | string | 图书名称
            bookPath    | 是   | string | 图书路径
            bookSize    | 是   | string | 图书大小
            mimetype    | 是   | string | 图书类型
            imgPath     | 是   | string | 背景图片路径
            meta        | 是   | Object | 创建时间

            * meta

                参数名称 | 必需 | 类型   | 描述
                ------------|------|---------|----------------
                updateAt    | 是   | string | 更新时间   
                createAt    | 是   | string | 创建时间


    1. 成功返回的数据


    2. 失败返回的数据


6. 发布评论
	--------

	- **接口地址 http://ip:port/comment/release**

    - **请求方法: POST**

    - **请求参数**

        参数名称 | 必需 | 类型   | 描述
        ----------|------|--------|--------------
        fileid    | 是   | string | 文件 ID
        comment   | 是   | string | 评论内容
        

    - **响应参数**

        参数名称 | 必需 | 类型   | 描述
        ------------|------|---------|----------------
        status      | 是   | boolean | 判断状态信息
        msg         | 是   | string  | 返回信息

    1. 成功返回的数据


    2. 失败返回的数据


7. 获取所有评论
	--------

	- **接口地址 http://ip:port/comment/results/:fileid**

    - **请求方法: GET**

    - **请求参数**

        参数名称 | 必需 | 类型   | 描述
        ----------|------|--------|--------------
        fileid    | 是   | string | 文件 ID
        

    - **响应参数**

        参数名称 | 必需 | 类型   | 描述
        ------------|------|---------|----------------
        status      | 是   | boolean | 判断状态信息
        comment     | 是   | Object  | 评论信息

        * comment

            参数名称 | 必需 | 类型   | 描述
            ------------|------|---------|----------------
            from    | 是   | string | 评论者 id   
            to      | 是   | string | 被评论的视频 id
            content | 是   | string | 评论内容
            meta    | 是   | string | 评论时间

            * meta

                参数名称 | 必需 | 类型   | 描述
                ------------|------|---------|----------------
                updateAt    | 是   | string | 更新时间   
                createAt    | 是   | string | 创建时间


    1. 成功返回的数据


    2. 失败返回的数据

