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
<!-- 文章管理 -->
<template>
  <div class="user-wrap">
    <div class="search-place">
      <el-input placeholder="请输入要搜索的文章标题" v-model="inputSearch" clearable></el-input>
      <el-button class="searchBtn" @click="search">搜索</el-button>
      <el-button type="success" @click="resetAll" class="searchBtn">重置</el-button>
    </div>
    <el-table :data="tableData" id="out-table" v-loading="loading">
      <template v-for="column in tableColumns">
        <el-table-column :label="column.label" :prop="column.prop">
        </el-table-column>
      </template>
      <el-table-column label="操作" prop="">
        <template slot-scope="scope">
          <!-- 查看 -->
          <el-button type="text" @click="showArticleInfo(scope.$index, scope.row)">查看</el-button>
          <el-dialog title='文章信息' :visible.sync="showVisible">
            <div>
              {{showCurrentArticle.title}}
            </div>
            <div v-html="showCurrentArticle.content"></div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="showVisible = false">取 消</el-button>
              <el-button type="primary" @click="showVisible = false">确 定</el-button>
            </div>
          </el-dialog>
          <!-- 删除 -->
          <el-button type="text" @click="getDelRow(scope.$index, scope.row)">删除</el-button>
          <el-dialog title="提示" :visible.sync="deleteVisible" width="30%">
            <span>确认删除?</span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="deleteVisible = false">取 消</el-button>
              <el-button type="danger" @click.native.prevent="deleteRow()">确 定</el-button>
            </span>
          </el-dialog>
        </template>
      </el-table-column>
    </el-table>
    <div class="blockPage">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :total="count" :current-page="current_page">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        inputSearch: '',
        showVisible: false,
        deleteVisible: false,
				tableData: [],
        tableColumns: [{
            label: 'id',
            prop: 'id'
          },
          {
            label: '文章标题',
            prop: 'title'
          },
          {
            label: '作者',
            prop: 'author.nickname'
          },
          {
            label: '点赞数',
            prop: 'likedUser.length'
          }
        ],
        delIndex: '',
        delRows: '',
        loading: true,
        count: 0,
				currentPageSave: 0,
				showCurrentArticle: {
					title: '',
					content: ''
				},
        isSearchExist: '',
        current_page: 1
      };
    },
    created() {
      this.getAllArticle()
    },
    mounted() {},
    methods: {
			// 获取所有文章信息
      getAllArticle() {
				this.$axios
					.get('/community')
					.then(results => {
						this.count = results.data.count
						this.tableData = results.data.rows
						this.loading = false
						this.isSearchExist = ''
					})
      },
			// 重置
      resetAll() {
        this.inputSearch = ''
        this.getAllArticle()
			},
			// 搜索
			search() {
				if (this.inputSearch === '') {
					this.$message.error('搜索不能为空')
				}
				this.isSearchExist = this.inputSearch
				this.$axios
					.get(`/community/search?key=${this.inputSearch}`)
					.then(result => {
						this.count = result.data.count
						this.tableData = result.data.rows						
					})
			},
      // 分页
      handleCurrentChange(val) {
        this.currentPageSave = val
        if (val == 0) {
          val += 1
				}
				if (this.isSearchExist !== '') {
					this.$axios
						.get(`/community?offset=${(val - 1)}?key=${this.isSearchExist}`)
						.then((results) => {
							this.tableData = results.data.rows
						})
				}else {
					this.$axios
						.get('/community?offset=' + (val - 1))
						.then((results) => {
							this.tableData = results.data.rows
						})
				}


      },
      // 获取点击的删除行
      getDelRow(index, rows) {
        this.deleteVisible = true
        this.delIndex = index
        this.delRows = rows
			},
			// 删除点击的当前行
			deleteRow() {
					this.deleteVisible = false
					this.tableData.splice(this.delIndex, 1);

					this.$axios.delete('/community/'+ this.delRows.id)
							.then((res) => {
                  this.$message('删除成功')
                  this.current_page = 1
							})
							.catch((error) => {
									this.$message.error('错了哦，这是一条错误消息');
							})
					
			},
      // 获取章节标题及内容
      showArticleInfo(index, rows) {
        this.$axios
          .get(`/community/${rows.id}`)
          .then(result => {
            this.showVisible = true
            this.showCurrentArticle = {
              title: result.data.title,
              content: result.data.content,
            }
          })
          .catch((error) => {
            this.$message.error('错了哦，这是一条错误消息');
          })
			},
    }
  };

</script>
