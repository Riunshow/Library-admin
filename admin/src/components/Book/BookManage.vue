<style scoped>
.search-place {
    height:50px;
}
.el-input {
    float: left;
    width: 30%;
}
.selectCate {
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
.optionsClick{
    margin: 10px;
}
</style>
<!-- 用户管理组件 -->
<template>
    <div class="user-wrap">
        <div class="search-place">
            <el-input placeholder="请输入书名" v-model="inputSearch" clearable></el-input>
            <el-button class="searchBtn" @click="searchBook">搜索</el-button>
            <!-- 导出到 excel -->
            <el-button type="primary" @click="exportExcel" class="searchBtn">导出到 Excel</el-button>
			<el-button type="success" @click="resetAll" class="searchBtn">重置</el-button>
            
            <el-select v-model="selectSearch" placeholder="分类筛选" filterable @change='getSearchCate' class="selectCate">
                <el-option  v-for="item in options" :key="item.value" :label="item.label" :value="item.label"></el-option>
            </el-select>
        </div>
        <el-table :data="tableData" id="out-table">
            <template v-for="column in tableColumns">
                <el-table-column :label="column.label" :prop="column.prop"></el-table-column>
            </template>
            <el-table-column
                label="操作"
                prop="">
                <template slot-scope="scope">
                    <!-- 详细信息 -->
                    <el-button type="text" @click="getBookInfo(scope.row)" >详细信息</el-button>                    
                    <!-- 修改分类 -->
                    <el-button type="text" @click="clickChangeCate(scope.row)" class="optionsClick">修改分类</el-button>
                    <el-dialog title="分类管理" :visible.sync="dialogFormVisible">
                        <el-form :model="form">
                            <el-form-item label="分类选择" :label-width="formLabelWidth">
                            <el-select v-model="form.region" placeholder="请选择分类">
                                <el-option  v-for="item in options" :key="item.value" :label="item.label" :value="item.label"></el-option>
                            </el-select>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="dialogFormVisible = false">取 消</el-button>
                            <el-button type="primary" @click="getChangeCate">确 定</el-button>
                        </div>
                    </el-dialog>
                    <!-- 删除 -->
                    <el-button type="text" @click="getDelRow(scope.$index, scope.row)">删除</el-button>
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
                nowTableData: [],
                tableColumns: [
                    { label: 'id', prop: 'id'},                    
                    { label: '入库日期', prop: 'date'},
                    { label: '书名', prop: 'name'},
                    { label: '分类', prop: 'cate'}
                ],
                delIndex: '',
                delRows: '',
                searchCate: '',
            };
        },
        mounted() {
            this.getCategory()            
            this.getAllBook()
        },
        methods: {
            getCategory() {
                const _this = this                
                axios.get('/book/category')
                    .then(results => {
                        _this.options = results.data
                    })
            },
            getAllBook() {
                const _this = this
                axios.get('/book')
                    .then(results => {
                        _this.tableData = results.data
                        _this.nowTableData = _this.tableData     
                    })
            },
            getBookInfo(row){
        		this.$store.commit('save_detail_bookInfo', row);
                this.$router.push({path: `bookinfo/${row.id}`})
            },
            clickChangeCate(row) {
                this.newRow = row                
                this.dialogFormVisible = true
            },
            getChangeCate() {
                const _this = this
                _this.dialogFormVisible = false;

                if (_this.form.region == '') {
                    _this.$message.error('修改失败,所选内容不能为空')
                }

                axios.put('/book/' + _this.newRow.id,{
                    category: _this.newRow.value
                }).then((result) => {
                    if (result.data.code == 0) {
                        _this.$message('修改成功')       
                        _this.newRow.cate = _this.form.region
                        console.log(_this.newRow);
                    } else{
                        _this.$message('修改失败,请刷新重试')
                    }
                })
                .catch((err) => {
                    console.log(err)
                    _this.$message.error('修改出现问题,请联系管理员')
                })

                
            },
            getDelRow(index, rows){
                this.dialogVisible = true
                this.delIndex = index
                this.delRows = rows
            },
            deleteRow() {
                this.dialogVisible = false
                this.tableData.splice(this.delIndex, 1);

                const _this = this

                axios.delete('/book/'+ this.delRows.id)
                    .then(() => {
                        _this.$message('删除成功')
                    })
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
            getSearchCate(value){
                this.searchCate = value
                this.tableData = []
                if (value == '全部') {
                    this.tableData = this.nowTableData                    
                } else {
                    for (const iter of this.nowTableData) {
                        if (iter.cate == this.searchCate) {
                            this.tableData.push(iter)
                        }
                    }
                }
            },
            searchBook() {
                const _this = this
                let options = {}
                // _this.tableData = []

                if (_this.inputSearch == '') {
                    _this.$message.error('请输入要搜索的名字')
                }else {
                    axios.post('/book/search', {
                        'name': _this.inputSearch,
                    })
                        .then((results) => {
                            _this.$message('搜索成功')
                            _this.tableData = results.data
                            _this.selectSearch = ''
                        })
                }
                
            },
            resetAll() {
                this.inputSearch = ''
                this.selectSearch = ''
                this.getAllBook()    
            },
        }
    };
</script>
