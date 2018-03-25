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
            <el-input placeholder="请输入书名" v-model="inputSearch" clearable></el-input>
            <el-select v-model="selectSearch" placeholder="请选择" filterable>
                <el-option  v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-button class="searchBtn">搜索</el-button>
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
                    <!-- 修改分类 -->
                    <el-button type="text" @click="clickChangeRole(scope.row)" class="options">修改分类</el-button>
                    <el-dialog title="分类管理" :visible.sync="dialogFormVisible">
                        <el-form :model="form">
                            <el-form-item label="分类选择" :label-width="formLabelWidth">
                            <el-select v-model="form.region" placeholder="请选择分类">
                                <el-option label="计算机" value="1"></el-option>
                                <el-option label="语言" value="2"></el-option>
                                <el-option label="艺术" value="3"></el-option>
                                <el-option label="视觉" value="4"></el-option>
                                <el-option label="设计" value="5"></el-option>
                            </el-select>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="dialogFormVisible = false">取 消</el-button>
                            <el-button type="primary" @click="getChangeRole">确 定</el-button>
                        </div>
                    </el-dialog>
                    <!-- 删除 -->
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
    import FileSaver from 'file-saver'
    import XLSX from 'xlsx'
    export default {
        data() {
            return {
                inputSearch: '',
                selectSearch: '',
                options: [{
                    value: '1',
                    label: '计算机'
                },{
                    value: '2',
                    label: '语言'
                },{
                    value: '3',
                    label: '艺术'
                },{
                    value: '4',
                    label: '视觉'
                },{
                    value: '5',
                    label: '设计'
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
                    value: '1'
                }, {
                    date: '2016-05-04',
                    name: '梁启源2',
                    value: '2'
                }, {
                    date: '2016-05-01',
                    name: '梁启源3',
                    value: '3'
                }, {
                    date: '2016-05-03',
                    name: '梁启源4',
                    value: '4'
                }, {
                    date: '2016-05-03',
                    name: '梁启源5',
                    value: '5'
                }],
                tableColumns: [
                    { label: '入库日期', prop: 'date'},
                    { label: '书名', prop: 'name'},
                    { label: '分类', prop: 'category'}
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
                    if (key.value == 1) {
                        key.category = '计算机'
                    }else if(key.value == 2) {
                        key.category = '语言'                        
                    }else if(key.value == 3) {
                        key.category = '艺术'                        
                    }else if(key.value == 4) {
                        key.category = '视觉'                     
                    }else if(key.value == 5){
                        key.category = '设计'                     
                    }
                }
            },
            clickChangeRole(row) {
                this.newRow = row                
                this.dialogFormVisible = true
            },
            getChangeRole() {
                this.dialogFormVisible = false;

                this.newRow.value = this.form.region
                if (this.form.region == 1) {
                    this.newRow.category = '计算机'
                }else if (this.form.region == 2) {
                    this.newRow.category = '语言'
                }else if (this.form.region == 3) {
                    this.newRow.category = '艺术'
                }else if (this.form.region == 4) {
                    this.newRow.category = '视觉'
                }else if(this.form.region == 5) {
                    this.newRow.category = '设计'
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
        }
    };
</script>
