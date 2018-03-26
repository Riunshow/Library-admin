<style scoped>
.search-place {
    height:50px;
}
.el-input {
    float: left;
    width: 30%;
}
.el-select {
    margin-left: 20px;
    float: left;
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
    margin-right: 30px;
}
</style>
<!-- 用户管理组件 -->
<template>
    <div class="user-wrap">
        <div class="search-place">
            <el-input placeholder="请输入姓名" v-model="inputSearch" clearable></el-input>
            <el-select v-model="selectSearch" placeholder="请选择" filterable @change='getSearchRole'>
                <el-option  v-for="item in options" :key="item.value" :label="item.label" :value="item.value" ></el-option>
            </el-select>
            <el-button class="searchBtn" @click="searchUser">搜索</el-button>
            <!-- 导出到 excel -->
            <el-button type="primary" @click="exportExcel" class="searchBtn">导出到 Excel</el-button>
        </div>
        <el-table :data="tableData" id="out-table">
            <template v-for="column in tableColumns">
                <el-table-column
                    :label="column.label"
                    :prop="column.prop">
                </el-table-column>
            </template>
            <el-table-column
                label="操作"
                prop="">
                <template scope="scope">
                    <!-- <el-button type="text" @click="onBtnDetailClick(scope.row)" class="options">详情</el-button> -->
                    <el-button type="text" @click="clickChangeRole(scope.row), dialogFormVisible = true" class="options">修改权限</el-button>
                    <el-dialog title="权限管理" :visible.sync="dialogFormVisible">
                        <el-form :model="form">
                            <el-form-item label="权限选择" :label-width="formLabelWidth">
                            <el-select v-model="form.region" placeholder="请选择权限">
                                <el-option label="系统管理员" value="20"></el-option>
                                <el-option label="图书管理员" value="10"></el-option>
                                <el-option label="老师" value="5"></el-option>
                                <el-option label="学生" value="0"></el-option>
                                <el-option label="其他" value="-1"></el-option>
                            </el-select>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="dialogFormVisible = false">取 消</el-button>
                            <el-button type="primary" @click="getChangeRole">确 定</el-button>
                        </div>
                    </el-dialog>
                    <el-button type="text" @click="getDelRow(scope.$index, tableData)">删除</el-button>
                    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
                        <span>确认删除?</span>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="dialogVisible = false">取 消</el-button>
                            <el-button type="danger" @click.native.prevent="deleteRow()">确 定</el-button>
                        </span>
                    </el-dialog>
                </template>
            </el-table-column>
        </el-table>
    </div>   
</template>

<script>
    import axios from 'axios'
    import FileSaver from 'file-saver'
    import XLSX from 'xlsx'
    export default {
        data() {
            return {
                inputSearch: '',
                selectSearch: '',
                options: [],
                dialogTableVisible: false,
                dialogFormVisible: false,
                dialogVisible: false,
                form: {
                    name: '',
                    region: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                },
                newRow: {},
                formLabelWidth: '120px',
                tableData: [],
                tableColumns: [
                    { label: 'id', prop: 'id'},                    
                    { label: '日期', prop: 'date'},
                    { label: '姓名', prop: 'name'},
                    { label: '身份', prop: 'identity'}
                ],
                delIndex: '',
                delRows: '',
                searchRole: '',
            };
        },
        created(){
            this.getCategory()
            this.getRoleToWord()               
        },
        mounted() {
        },
        methods: {
            getCategory() {
                const _this = this                
                axios.get('/user/category')
                    .then(results => {
                        _this.options = results.data
                    })
            },
            getRoleToWord() {
                const _this = this
                axios.get('/user/manage')
                    .then(results => {
                        _this.tableData = results.data
                    })
                    .then(() => {
                        for (const key of _this.tableData) {
                            if (key.role == 20) {
                                key.identity = '系统管理员'
                            }else if(key.role == 10) {
                                key.identity = '图书管理员'                        
                            }else if(key.role == 5) {
                                key.identity = '老师'                        
                            }else if(key.role == 0) {
                                key.identity = '学生'                     
                            }else {
                                key.identity = '其他'                     
                            }
                        }
                    })
                
            },
            // onBtnDetailClick(row) {
            //     // 1. 用户详情存vuex
            //     this.$store.commit('save_detail_info', row);
            //     // 2. 动态改变路由的指向
            //     this.$router.push({
            //         path: `/userInfo/${row.name}`
            //     });
            // },
            clickChangeRole(row) {
                this.newRow = row            
            },
            getChangeRole() {
                const _this = this
                _this.dialogFormVisible = false;
                _this.newRow.role = this.form.region

                if (this.form.region == '') {
                    _this.$message.error('修改失败,所选内容不能为空')
                    return;                    
                }

                axios.post('/user/change',{
                    id: _this.newRow.id,
                    role: _this.newRow.role
                }).then((result) => {
                    if (result.data.code == 0) {
                        _this.$message('修改成功')       

                    } else{
                        _this.$message('修改失败,请刷新重试')
                    }
                })
                .catch((err) => {
                    console.log(err)
                    _this.$message.error('修改出现问题,请联系管理员')
                })

                if (_this.form.region == 20) {                      
                    _this.newRow.identity = '系统管理员'   
                    console.log(_this.newRow.identity)          
                }else if (_this.form.region == 10) {
                    _this.newRow.identity = '图书管理员'
                }else if (_this.form.region == 5) {
                    _this.newRow.identity = '老师'
                }else if (_this.form.region == 0) {
                    _this.newRow.identity = '学生'
                }else{
                    _this.newRow.identity = '其他'
                }           
            },
            getDelRow(index, rows){
                this.dialogVisible = true
                this.delIndex = index
                this.delRows = rows
            },
            deleteRow() {
                this.dialogVisible = false
                this.delRows.splice(this.delIndex, 1);
            },
            exportExcel () {
                /* generate workbook object from table */
                var wb = XLSX.utils.table_to_book(document.querySelector('#out-table'))
                /* get binary string as output */
                var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
                try {
                    FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'book-manage.xlsx')
                } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
                return wbout
            },
            getSearchRole(value){
                this.searchRole = value
            },
            searchUser() {
                const _this = this
                let options = {}
                // _this.tableData = []

                if (_this.inputSearch == '' && _this.selectSearch == '') {
                    _this.$message.error('请输入要搜索的名字或选择要搜索的分类')
                    return;
                }else if(_this.inputSearch == '') {
                    options = {
                        'role': _this.searchRole
                    }
                }else if(_this.selectSearch == '') {
                    options = {
                        'name': _this.inputSearch,
                    }
                }else {
                    options = {
                        'name': _this.inputSearch,
                        'role': _this.searchRole
                    }
                }
                axios.post('/user/search', options)
                    .then((results) => {
                        _this.tableData = results.data
                        for (const key of _this.tableData) {
                            if (key.role == 20) {
                                key.identity = '系统管理员'
                            }else if(key.role == 10) {
                                key.identity = '图书管理员'                        
                            }else if(key.role == 5) {
                                key.identity = '老师'                        
                            }else if(key.role == 0) {
                                key.identity = '学生'                     
                            }else {
                                key.identity = '其他'                     
                            }
                        }
                        this.$message('搜索成功')
                    })
            },
        }
    };
</script>
