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
.selectCategoryClick{
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
            <el-input placeholder="请输入书名" v-model="inputSearch" clearable></el-input>
            <el-button class="searchBtn" @click="searchBook">搜索</el-button>
            <!-- 导入excel -->
            <el-button class="uploadExcel searchBtn" @click="addClick">
                导入 excel
                <input ref="importExcel" class="uploadInput" type="file" @change="importExcel(this)" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"></input>
            </el-button>
            <!-- 导出到 excel -->
            <el-button type="primary" @click="exportExcel" class="searchBtn">导出到 Excel</el-button>
			<el-button type="success" @click="resetAll" class="searchBtn">重置</el-button>
            
            <!-- 分类筛选 -->
            <!-- <el-select v-model="selectSearch" placeholder="分类筛选" filterable @change='getSearchCate' class="selectCate">
                <el-option  v-for="item in selectCategory" :key="item.value" :label="item.label" :value="item.label"></el-option>
            </el-select> -->

        </div>
        <el-table :data="tableData" id="out-table" v-loading="loading">
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
                    <el-button type="text" @click="clickChangeCate(scope.row)" class="selectCategoryClick">修改分类</el-button>
                    <el-dialog title="分类管理" :visible.sync="dialogFormVisible">
                        <el-form :model="formChangeCate">
                            <el-form-item label="分类选择" :label-width="formLabelWidth">
                            <!-- <el-select v-model="formChangeCate.region" placeholder="请选择分类">
                                <el-option  v-for="item in selectCategory" :key="item.value" :label="item.label" :value="item.label"></el-option>
                            </el-select> -->
                            <el-cascader
                                :options="selectCategory"
                                @active-item-change="handleCateChange"
                                :props="props"
                                expand-trigger="hover"
                                v-model="chooseType"
                            ></el-cascader>

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
        <!-- 分页 -->
        <div class="blockPage" v-show="showPagination">
            <el-pagination
                layout="prev, pager, next"
                @current-change="handleCurrentChange"
                :total="count">
            </el-pagination>
        </div>
        <div class="blockPage" v-show="!showPagination">
            <span>搜索结果只展示 10 条数据</span>
        </div>
    </div>   
</template>

<script>
    import FileSaver from 'file-saver'
    import XLSX from 'xlsx'
    export default {
        data() {
            return {
                loading: true,
                showPagination: true,
                inputSearch: '',
                selectSearch: '',
                selectCategory: [],
                dialogTableVisible: false,
                dialogFormVisible: false,
                dialogVisible: false,
                formChangeCate: {
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
                    { label: '入库日期', prop: 'updated_at'},
                    { label: '书名', prop: 'name'},
                    { label: '分类', prop: 'Category.type'}
                ],
                delIndex: '',
                delRows: '',
                searchCate: '',
                count: 0, // 书的总数
                isFileChange: true,
                currentPageSave: 1,
                loading: true,
                props: {
                    value: 'label',
                    children: 'type',
                },
                chooseType: [],
                newChangeCate: []
            };
        },
        mounted() {
            this.getCategory()            
            this.getAllBook()
        },
        methods: {
            // 获取书的所有分类
            getCategory() {
                this.$axios.get('/category')
                    .then(results => {
                        let temp = results.data
                        temp.map((x) => {
                            x.label = x.category
                            delete x.category
                            x.type = []
                        })
                        this.selectCategory = temp
                    })
            },
            // 获取所有书的数据
            getAllBook() {
                this.$axios.get('/book')
                    .then(results => {
                        this.count = results.data.count
                        this.tableData = results.data.rows
                        this.nowTableData = this.tableData 
                        this.loading = false  
                    })
            },
            // 书详细信息
            getBookInfo(row){
        		this.$store.commit('save_detail_bookInfo', row);
                this.$router.push({path: `bookinfo/${row.id}`})
            },
            // 点击修改分类按钮
            clickChangeCate(row) {
                this.newRow = row
                this.dialogFormVisible = true
            },
            // 根据大类获取小类
            handleCateChange(val){
                this.$axios
                    .get('/category/type?category='+val)
                    .then((results) => {
                        let temp = results.data
                        temp.map((x) => {
                            x.label = x.type
                            delete x.type
                        })

                        // 将子分类 type 与 id 形成映射,生成新数组 newChangeCate
                        for (let index = 0; index < temp.length; index++) {
                            this.newChangeCate[temp[index].id] = temp[index].label
                        }
                        // 获取子分类
                        for (let index = 0; index < this.selectCategory.length; index++) {
                            if (this.selectCategory[index].label === val.toString()) {
                                this.selectCategory[index].type = temp
                            }
                        }
                    })
            },
            // 确认修改图书分类
            getChangeCate() {
                this.dialogFormVisible = false;
                let typeID = 0;
                // 获取选择的 type 的 id
                for (let index = 0; index < this.newChangeCate.length; index++) {
                    if (this.chooseType[1] === this.newChangeCate[index]) {
                        typeID = index
                    }
                }
                this.$axios.put(`/book/${this.newRow.id}/type`,{
                    cid: typeID
                }).then((result) => {
                    this.$message('修改成功')    
                    this.newRow.Category.type = this.newChangeCate[typeID]
                })
                .catch((err) => {
                    console.log(err)
                    this.$message.error('修改出现问题,请联系管理员')
                })

                
            },
            // 分页
            handleCurrentChange(val) {
                console.log('当前页', val);
                this.currentPageSave = val
                this.$axios
                    .get('/book?offset=' + (val-1))
                    .then((results) => {
                        this.tableData = results.data.rows
                        this.nowTableData = this.tableData     
                    })
                
            },
            // 获取点击的删除行
            getDelRow(index, rows){
                this.dialogVisible = true
                this.delIndex = index
                this.delRows = rows
            },
            // 删除点击的当前行
            deleteRow() {
                this.dialogVisible = false
                this.tableData.splice(this.delIndex, 1);

                this.$axios.delete('/book/'+ this.delRows.id)
                    .then((res) => {
                        this.$message('删除成功')
                        this.getAllBook()
                    })
                    .catch((error) => {
                        this.$message.error('错了哦，这是一条错误消息');
                    })
                
            },
            // 导出到 excel
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
            // 导入 excel
            importExcel(obj) {

                let _this = this;
                let inputDOM = this.$refs.inputer;
                console.log(inputDOM)
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
                            obj.name = v.name
                            obj.cover = v.cover
                            obj.cid = v.cid
                            obj.company = v.company
                            obj.author = v.author
                            obj.blurb = v.blurb
                            obj.position = v.position
                            obj.pdate = v.pdate

                            arr.push(obj)
                        })
                        _this.$axios.post('/book', {
                            booklist: arr
                        }).then((res) => {
                            _this.$message({
                                message: '请耐心等待导入成功',
                                type: 'success'
                            });
                            _this.$refs.importExcel.value = null;
                            _this.getAllBook()
                            _this.handleCurrentChange(_this.currentPageSave)
                        }).catch((erro) => {
                            _this.$message.error('错了哦，这是一条错误消息');
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
            // getSearchCate(value){
            //     this.searchCate = value
            //     this.tableData = []
            //     if (value == '全部') {
            //         this.tableData = this.nowTableData                    
            //     } else {
            //         for (const iter of this.nowTableData) {
            //             if (iter.cate == this.searchCate) {
            //                 this.tableData.push(iter)
            //             }
            //         }
            //     }
            // },
            // 搜索书籍
            searchBook() {
                let selectCategory = {}
                this.showPagination = false
                if (this.inputSearch == '') {
                    this.$message.error('请输入要搜索的名字')
                }else {
                    this.$axios
                        .get('/book/search?bookname=' + this.inputSearch)
                        .then((results) => {
                            this.$message('搜索成功')
                            this.tableData = results.data
                            this.selectSearch = ''
                        })
                        .catch(() => {
                            this.$message.error('搜索失败,请重试')
                        })
                }
                
            },
            resetAll() {
                this.inputSearch = ''
                this.selectSearch = ''
                this.showPagination = true
                this.getAllBook()    
            },
        }
    };
</script>
