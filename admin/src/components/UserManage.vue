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
            <el-select v-model="selectSearch" placeholder="请选择" filterable>
                <el-option  v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-button class="searchBtn">搜索</el-button>
        </div>
        <el-table :data="tableData">
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
                    <el-button type="text" @click="clickChangeRole(scope.row)" class="options">修改权限</el-button>
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
    export default {
        data() {
            return {
                inputSearch: '',
                selectSearch: '',
                options: [{
                    value: '20',
                    label: '系统管理员'
                },{
                    value: '10',
                    label: '图书管理员'
                },{
                    value: '5',
                    label: '老师'
                },{
                    value: '0',
                    label: '学生'
                },{
                    value: '-1',
                    label: '其他'
                }],
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
                tableData: [{
                    date: '2016-05-02',
                    name: '梁启源1',
                    role: '10'
                }, {
                    date: '2016-05-04',
                    name: '梁启源2',
                    role: '20'
                }, {
                    date: '2016-05-01',
                    name: '梁启源3',
                    role: '10'
                }, {
                    date: '2016-05-03',
                    name: '梁启源4',
                    role: '20'
                }],
                tableColumns: [
                    { label: '日期', prop: 'date'},
                    { label: '姓名', prop: 'name'},
                    { label: '身份', prop: 'identity'}
                ],
                delIndex: '',
                delRows: ''
            };
        },
        mounted() {
            this.getRoleToWord()
        },
        methods: {
            getRoleToWord() {
                for (const key of this.tableData) {
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
                this.dialogFormVisible = true
            },
            getChangeRole() {
                this.dialogFormVisible = false;

                this.newRow.role = this.form.region
                if (this.form.region == 20) {
                    this.newRow.identity = '系统管理员'
                }else if (this.form.region == 10) {
                    this.newRow.identity = '图书管理员'
                }else if (this.form.region == 5) {
                    this.newRow.identity = '老师'
                }else if (this.form.region == 0) {
                    this.newRow.identity = '学生'
                }else{
                    this.newRow.identity = '其他'
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
            }
        }
    };
</script>
