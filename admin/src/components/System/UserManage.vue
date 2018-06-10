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
</style>
<!-- 用户管理组件 -->
<template>
    <div class="user-wrap">
        <div class="search-place">
            <el-input placeholder="请输入要搜索用户名" v-model="inputSearch" clearable></el-input>
            <el-button class="searchBtn" @click="searchUser">搜索</el-button>
            <!-- 导出到 excel -->
            <el-button type="primary" @click="exportExcel" class="searchBtn">导出到 Excel</el-button>
            <el-button type="success" @click="resetAll" class="searchBtn">重置</el-button>
            <el-select v-model="selectSearch" placeholder="分类筛选" filterable @change='getSearchRole' class="selectRole">
                <el-option  v-for="item in options" :key="item.value" :label="item.label" :value="item.value" ></el-option>
            </el-select>
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
            };
        },
        created(){
            this.getAllUser()               
        },
        mounted() {
        },
        methods: {
            getAllUser() {
                const _this = this
                this.$axios.get('/admin/user/-1')
                    .then(results => {
                        for (const key of results.data) {
                            if (key.role == 3) {
                                key.rolename = '系统管理员'
                            } else if (key.role == 2) {
                                key.rolename = '图书管理员'
                            } else if (key.role == 1) {
                                key.rolename = '普通用户'                                
                            }
                        }
                        _this.tableData = results.data
                        _this.nowTableData = _this.tableData
                        this.loading = false
                    })
            },
            getUserInfo(row){
        		this.$store.commit('save_detail_userInfo', row);
                this.$router.push({path: `userinfo/${row.id}`})
            },
            clickChangeRole(row) {
                this.newRow = row     
            },
            getChangeRole(value) {
                this.selectRole = value;
            },
            changeRole() {
                const _this = this
                _this.dialogFormVisible = false;
                if (_this.form.region == '') {
                    _this.$message.error('修改失败,所选内容不能为空')
          
                }else if(_this.form.region == '全部'){
                    _this.$message.error('修改失败')
                   
                }else{
                    this.$axios.put('/admin/' + _this.newRow.id,{
                        role: _this.selectRole
                    }).then((result) => {
                        if (result.data[0] == 1) {
                            _this.$message('修改成功')
                            if (_this.selectRole == 3) {
                                 _this.newRow.rolename = '系统管理员'
                            } else if (_this.selectRole == 2) {
                                 _this.newRow.rolename = '图书管理员'
                            } else if (_this.selectRole == 1) {
                                 _this.newRow.rolename = '普通用户'                                
                            }                                     
                        } else{
                            _this.$message('修改失败,请刷新重试')
                        }
                    }).catch((err) => {
                        _this.$message.error('修改出现问题,请联系管理员')
                    })
                    
                }
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
                const _this = this
                let options = {}
                this.tableData = []

                if (_this.inputSearch == '' && _this.selectSearch == '') {
                    _this.$message.error('请输入要搜索的用户名')
                    return;
                }
                this.$axios.get('/admin/search?name=' + _this.inputSearch)
                    .then((results) => {
                        _this.tableData = results.data
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
