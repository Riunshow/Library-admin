<style scoped>
.search-place {
    height:50px;
}
.el-input {
    float: left;
    width: 30%;
}
.selectRole {
    float: right;
}
.searchBtn {
    margin-left: 30px;
}
.el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
.el-icon-arrow-down {
    font-size: 12px;
}
.options{
    margin: 10px;
}
.uploadExcel input[type=file]
{
    display: none;
}
.blockPage {
    text-align: center;
    margin-top: 20px;
    margin-bottom: -50px;
}
</style>
<!-- 用户管理组件 -->
<template>
    <div class="user-wrap">
        <div class="search-place">
            <el-input placeholder="请输入要搜索用户名" v-model="inputSearch" clearable></el-input>
            <el-button class="searchBtn" @click="searchUser">搜索</el-button>
             <!-- 导入excel -->
            <el-button class="uploadExcel searchBtn" @click="addClick">
                导入 excel
                <input ref="importExcel" class="uploadInput" type="file" @change="importExcel(this)" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"></input>
            </el-button>
            <!-- 导出到 excel -->
            <el-button type="primary" @click="exportExcel" class="searchBtn">导出到 Excel</el-button>
            <el-button type="success" @click="resetAll" class="searchBtn">重置</el-button>
            <!-- <el-select v-model="selectSearch" placeholder="分类筛选" filterable @change='getSearchRole' class="selectRole">
                <el-option  v-for="item in options" :key="item.value" :label="item.label" :value="item.value" ></el-option>
            </el-select> -->
        </div>
        <el-table :data="tableData" id="out-table" v-loading="loading">
            <template v-for="column in tableColumns">
                <el-table-column
                    :label="column.label"
                    :prop="column.prop">
                </el-table-column>
            </template>
            <el-table-column
                label="操作"
                prop="">
                <template slot-scope="scope">
                    <!-- 详细信息 -->
                    <el-button type="text" @click="getUserInfo(scope.row)">详细信息</el-button>                
                    <el-button type="text" @click="clickChangeRole(scope.row), dialogFormVisible = true" class="options">修改权限</el-button>
                    <el-dialog title="权限管理" :visible.sync="dialogFormVisible">
                        <el-form :model="form">
                            <el-form-item label="权限选择" :label-width="formLabelWidth">
                            <el-select v-model="form.region" placeholder="请选择权限" @change="getChangeRole">
                                <el-option  v-for="item in changeRoleoptions" :key="item.value" :label="item.label" :value="item.value" ></el-option>
                            </el-select>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="dialogFormVisible = false">取 消</el-button>
                            <el-button type="primary" @click="changeRole()">确 定</el-button>
                        </div>
                    </el-dialog>
                </template>
            </el-table-column>
        </el-table>
        <div class="blockPage">
            <el-pagination
                layout="prev, pager, next"
                @current-change="handleCurrentChange"
                :total="count">
            </el-pagination>
        </div>
    </div>   
</template>

<script>
    import FileSaver from 'file-saver'
    import XLSX from 'xlsx'
    export default {
        data() {
            return {
                inputSearch: '',
                selectSearch: '',               
                options: [{
                    value: '-1',
                    label: '全部',
                }, {
                    value: '3',
                    label: '系统管理员',
                }, {
                    value: '2',
                    label: '图书管理员',
                }, {
                    value: '1',
                    label: '普通用户',
                }],
                changeRoleoptions: [{
                    value: '3',
                    label: '系统管理员',
                }, {
                    value: '2',
                    label: '图书管理员',
                }, {
                    value: '1',
                    label: '普通用户',
                }],
                dialogTableVisible: false,
                dialogFormVisible: false,
                dialogVisible: false,
                form: {
                    name: '',
                    region: '',
                    role:'',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                },
                newRow: {},
                formLabelWidth: '120px',
                tableData: [],
                nowTableData: [],
                tableColumns: [
                    { label: 'id', prop: 'id'},                    
                    { label: '用户名', prop: 'account'},
                    { label: '姓名', prop: 'nickname'},
                    { label: '身份', prop: 'rolename'}
                ],
                delIndex: '',
                delRows: '',
                searchRole: '',
                selectRole: '', // 修改权限时,选择的 role
                loading: true,
                count: 0,
                currentPageSave: 0,
            };
        },
        created(){
            this.getAllUser()               
        },
        mounted() {
        },
        methods: {
            getAllUser() {
                this.$axios.get('/admin/user/-1')
                    .then(results => {
                        this.count = results.data.count
                        for (const key of results.data.rows) {
                            if (key.role == 3) {
                                key.rolename = '系统管理员'
                            } else if (key.role == 2) {
                                key.rolename = '图书管理员'
                            } else if (key.role == 1) {
                                key.rolename = '普通用户'                                
                            }
                        }
                        this.tableData = results.data.rows
                        this.nowTableData = this.tableData.rows
                        this.loading = false
                    })
            },
            getUserInfo(row){
        		this.$store.commit('save_detail_userInfo', row);
                this.$router.push({path: `userinfo/${row.id}`})
            },
            // 分页
            handleCurrentChange(val) {
                this.currentPageSave = val
                if (val == 0) {
                    val += 1
                }
                this.$axios
                    .get('/admin/user/-1?offset=' + (val-1))
                    .then((results) => {
                        for (const key of results.data.rows) {
                            if (key.role == 3) {
                                key.rolename = '系统管理员'
                            } else if (key.role == 2) {
                                key.rolename = '图书管理员'
                            } else if (key.role == 1) {
                                key.rolename = '普通用户'                                
                            }
                        }
                        this.tableData = results.data.rows
                        this.nowTableData = this.tableData.rows
                    })
                
            },
            clickChangeRole(row) {
                this.newRow = row     
            },
            getChangeRole(value) {
                this.selectRole = value;
            },
            changeRole() {
                this.dialogFormVisible = false;
                if (this.form.region == '') {
                    this.$message.error('修改失败,所选内容不能为空')
          
                }else if(this.form.region == '全部'){
                    this.$message.error('修改失败')
                   
                }else{
                    this.$axios.put('/admin/' + this.newRow.id,{
                        role: this.selectRole
                    }).then((result) => {
                        if (result.data[0] == 1) {
                            this.$message('修改成功')
                            if (this.selectRole == 3) {
                                 this.newRow.rolename = '系统管理员'
                            } else if (this.selectRole == 2) {
                                 this.newRow.rolename = '图书管理员'
                            } else if (this.selectRole == 1) {
                                 this.newRow.rolename = '普通用户'                                
                            }                                     
                        } else{
                            this.$message('修改失败,请刷新重试')
                        }
                    }).catch((err) => {
                        this.$message.error('修改出现问题,请联系管理员')
                    })
                    
                }
            },
            exportExcel () {
                /* generate workbook object from table */
                var wb = XLSX.utils.table_to_book(document.querySelector('#out-table'))
                /* get binary string as output */
                var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
                try {
                    FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'user-manage.xlsx')
                } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
                return wbout
            },
            // 导入 excel
            importExcel(obj) {
                let inputDOM = this.$refs.inputer;
                // 通过DOM取文件数据
                this.file = event.currentTarget.files[0];
                var rABS = false; //是否将文件读取为二进制字符串
                var f = this.file;
                var reader = new FileReader();
                //if (!FileReader.prototype.readAsBinaryString) {
                FileReader.prototype.readAsBinaryString = function(f) {
                    var binary = "";
                    var rABS = false; //是否将文件读取为二进制字符串
                    var pt = this;
                    var wb; //读取完成的数据
                    var outdata;
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        var bytes = new Uint8Array(reader.result);
                        var length = bytes.byteLength;
                        for(var i = 0; i < length; i++) {
                            binary += String.fromCharCode(bytes[i]);
                        }
                        var XLSX = require('xlsx');
                        if(rABS) {
                            wb = XLSX.read(btoa(fixdata(binary)), { //手动转化
                                type: 'base64'
                            });
                        } else {
                            wb = XLSX.read(binary, {
                                type: 'binary'
                            });
                        }
                        outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);//outdata就是你想要的东西
                        this.da = [...outdata]
                        let arr = []
                        this.da.map(v => {
                            let obj = {}
                            obj.account = v.account
                            obj.nickname = v.nickname
                            obj.avatar = v.avatar
                            obj.signature = v.signature
                            obj.password = v.password
                            arr.push(obj)
                        })
                        this.$axios.post('/admin/register', {
                            userList: arr
                        }).then((res) => {
                            this.$message({
                                message: '请耐心等待导入成功',
                                type: 'success'
                            });
                            this.$refs.importExcel.value = null;
                            this.getAllUser()
                            this.handleCurrentChange(this.currentPageSave)
                        }).catch((erro) => {
                            this.$message.error('错了哦，这是一条错误消息');
                        })
                    }
                    reader.readAsArrayBuffer(f);
                }
                if(rABS) {
                    reader.readAsArrayBuffer(f);
                } else {
                    reader.readAsBinaryString(f);
                }
            },
            addClick() {
                const addInput = document.querySelector('.uploadInput')
                addInput.click();
            },
            getSearchRole(value){
                this.searchRole = value
                this.tableData = []
                if (value == -1) {
                    this.tableData = this.nowTableData
                } else {
                    for (const iter of this.nowTableData) {
                        if (iter.role == this.searchRole) {
                            this.tableData.push(iter)
                        }
                    }
                }
            },
            searchUser() {
                let options = {}
                this.tableData = []

                if (this.inputSearch == '' && this.selectSearch == '') {
                    this.$message.error('请输入要搜索的用户名')
                    return;
                }
                this.$axios.get('/admin/search?name=' + this.inputSearch)
                    .then((results) => {
                        for (const key of results.data.rows) {
                            if (key.role == 3) {
                                key.rolename = '系统管理员'
                            } else if (key.role == 2) {
                                key.rolename = '图书管理员'
                            } else if (key.role == 1) {
                                key.rolename = '普通用户'                                
                            }
                        }
                        this.tableData = results.data.rows
                        this.count = results.data.count
                        
                        this.$message('搜索成功')
                    })
                    .catch((err) => {
                        this.$message.error('搜索失败')
                    })
            },
            resetAll() {
                this.inputSearch = ''
                this.selectSearch = ''
                this.getAllUser()               
            },
        }
    };
</script>
