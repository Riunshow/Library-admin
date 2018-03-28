const Mock = require('mockjs');
const Random = Mock.Random;

// 登录
const loginUser = (opt) => {
    const options = JSON.parse(opt.body)
    let user = {}
    if (options.user_num == 'sysadmin') {
        let newUserObject = {
            username: 'sysadmin',
            role: '20',
            code: 0,
        }
        user = newUserObject
    } else if (options.user_num == 'bookadmin') {
        let newUserObject = {
            username: 'bookadmin',
            role: '10',
            code: 0,
        }
        user = newUserObject
    } else {
        let newUserObject = {
            code: -1,
        }
        user = newUserObject
    }
    return user;
}

// 退出
const logout = () => {
    let user = {}
    return user
}


const userManage = () => {
    let users = []
    let randomArray = [0, 5, 10, 20]
    for (let i = 0; i < 5; i++) {
        let newUser = {
            date: Random.date(),
            name: Random.cname(),
            role: Random.pick(randomArray),
            id: Random.string(7),
        }
        users.push(newUser)
    }
    return users;
}

const allManager = () => {
    const manageCategory = [{
        value: '100',
        label: '全部'
    }, {
        value: '20',
        label: '系统管理员'
    }, {
        value: '10',
        label: '图书管理员'
    }, {
        value: '5',
        label: '老师'
    }, {
        value: '0',
        label: '学生'
    }, {
        value: '-1',
        label: '其他'
    }]

    return manageCategory;
}

const changeRole = (opt) => {
    /**
     * 请求参数
     * {id: "dXW&DH0", role: "0"}
     * 
     * role
     * 
     * 20 -> 系统管理员
     * 10 -> 图书管理员
     * 5 -> 老师
     * 0 -> 学生
     * -1 -> 其他
     * 
     */
    const options = JSON.parse(opt.body)
    let randomArray = [0, 1]

    // code = 0 为成功
    const result = {
        // code: Random.pick(randomArray),
        code: 0,
        msg: 'change success'
    }

    return result;
}

const searchUser = (opt) => {
    const options = JSON.parse(opt.body)
    console.log(options)

    let users = []
    let randomArray = [0, 5, 10, 20]
    for (let i = 0; i < 5; i++) {
        let newUser = {
            date: Random.date(),
            name: Random.cname(),
            role: Random.pick(randomArray),
            id: Random.string(7),
        }
        users.push(newUser)
    }
    return users;
}
const delUser = (opt) => {
    /**
     * 传入参数
     * {id: ")EuI0eb"}
     */
    const options = JSON.parse(opt.body)
    console.log(options)
}

Mock.mock('/user/login', 'post', loginUser);
Mock.mock('/user/logout', 'post', logout);
Mock.mock('/user/category', 'get', allManager);

Mock.mock('/user', 'get', userManage);
Mock.mock('/user/:userid', 'put', changeRole);
Mock.mock('/user/:userid', 'del', delUser);

Mock.mock('/user/search', 'post', searchUser);

// **********************************************************
//  图书

const searchBook = (opt) => {
    /**
     * 请求参数
     * {name: "a", value: "1"}
     */
    const options = JSON.parse(opt.body)
    console.log(options)

    let books = []
    let randomArray = [1, 2, 3, 4, 5]
    for (let i = 0; i < 5; i++) {
        let newBook = {
            date: Random.date(),
            name: Random.cname(),
            value: Random.pick(randomArray),
            id: Random.string(7),
        }
        books.push(newBook)
    }
    return books;
}

const allBookCate = () => {
    const bookCategory = [{
        value: '100',
        label: '全部'
    }, {
        value: '1',
        label: '计算机'
    }, {
        value: '2',
        label: '语言'
    }, {
        value: '3',
        label: '艺术'
    }, {
        value: '4',
        label: '视觉'
    }, {
        value: '5',
        label: '设计'
    }]

    return bookCategory;
}

const bookManage = () => {
    let books = []
    let randomArray = [1, 2, 3, 4, 5]
    for (let i = 0; i < 5; i++) {
        let newBook = {
            date: Random.date(),
            name: Random.cname(),
            value: Random.pick(randomArray),
            id: Random.string(7),
        }
        books.push(newBook)
    }
    return books;
}

const changeCate = (opt) => {
    const options = JSON.parse(opt.body)
        /**
         * 请求参数
         * {id: "dXW&DH0", category: "1"}
         * 
         * category
         * 
         * 1 -> 计算机
         * 2 -> 语言
         * 3 -> 艺术
         * 4 -> 视觉
         * 5 -> 设计
         * 
         */
    console.log(options)
        // let randomArray = [0, 1]

    // code = 0 为成功
    const result = {
        // code: Random.pick(randomArray),
        code: 0,
        msg: 'change success'
    }

    return result;
}

const delBook = (opt) => {
    /**
     * 传入参数
     * {id: ")EuI0eb"}
     */
    const options = JSON.parse(opt.body)
    console.log(options)
}

Mock.mock('/book/search', 'post', searchBook);
Mock.mock('/book/category', 'get', allBookCate);

// *******
// 添加分类
Mock.mock('/book/category', 'post', allBookCate);
Mock.mock('/book', 'post', allBookCate);
// *******

Mock.mock('/book', 'get', bookManage);
Mock.mock('/book/:bookid', 'put', changeCate);
Mock.mock('/book/:bookid', 'del', delBook);