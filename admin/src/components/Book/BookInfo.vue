<style lang="css" scoped>
  img {
	margin-top: 10px;
}
.book_chapter {
	margin: 15px 0;
}
.chapter_basic {
	height: 40px;
}
.chapter_basic p{
	line-height: 40px;
	margin-bottom: 15px;
	float: left;
}
.addBookChpater {
	float: right;
	margin-right: 15px;
}
.edit {
	margin-left: 15px;
	margin-right: 5px;
}
</style>
<template>
  <div id="bookinfo">
    <el-table :data="bookData" style="width: 100%" v-loading="loading">
      <el-table-column label="图片" width="100">
        <template slot-scope="scope">
          <img :src="scope.row.cover" width="40" height="40" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="书名" width="100">
      </el-table-column>
      <el-table-column prop="author" label="作者" width="100">
      </el-table-column>
      <el-table-column prop="company" label="出版社" width="150">
      </el-table-column>
      <!-- <el-table-column
				prop="numeration"
				label="图书编号"
				width="150">
			</el-table-column> -->
      <el-table-column prop="blurb" label="图书简介" width="450">
      </el-table-column>
      <el-table-column prop="pdate" label="出版时间" width="100">
      </el-table-column>
      <el-table-column label="操作" prop="">
        <template slot-scope="scope">
          <el-button type="text" @click="dialogFormVisible = true">修改</el-button>
          <el-dialog title="图书信息" :visible.sync="dialogFormVisible">
            <el-form :model="bookForm">
              <el-form-item label="图片" :label-width="formLabelWidth">
                <el-input v-model="bookForm.cover" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="书名" :label-width="formLabelWidth">
                <el-input v-model="bookForm.name" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="作者" :label-width="formLabelWidth">
                <el-input v-model="bookForm.author" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="出版社" :label-width="formLabelWidth">
                <el-input v-model="bookForm.company" auto-complete="off"></el-input>
              </el-form-item>
              <!-- <el-form-item label="图书编号" :label-width="formLabelWidth">
								<el-input v-model="bookForm.numeration" auto-complete="off"></el-input>
							</el-form-item> -->
              <el-form-item label="图书简介" :label-width="formLabelWidth">
                <el-input v-model="bookForm.blurb" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="出版时间" :label-width="formLabelWidth">
                <el-input v-model="bookForm.pdate" auto-complete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="updateBookInfo">确 定</el-button>
            </div>
          </el-dialog>
        </template>
      </el-table-column>
    </el-table>
    <!-- 图书章节展示 -->
    <div class="book_chapter">
      <div class="chapter_basic">
        <p>图书章节管理</p>
        <!-- 添加章节信息 -->
        <el-button class="addBookChpater" type="primary" @click="addBookChpater">添加章节</el-button>
      </div>
      <el-table :data="chapterData" style="width: 100%" v-loading="loading">
        <el-table-column prop="title" label="章节名称" width="600">
        </el-table-column>
        <el-table-column label="操作" prop="">
          <template slot-scope="scope">
            <el-button type="text" @click="showChapterInfo(scope.$index, scope.row)">查看</el-button>
            <el-dialog title='章节信息' :visible.sync="dialogBookChapterVisible">
              <div>
                {{showCurrentChapter.title}}
              </div>
              <div v-html="showCurrentChapter.content"></div>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogBookChapterVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogBookChapterVisible = false">确 定</el-button>
              </div>
            </el-dialog>
            <!-- 编辑 -->
            <el-button class="edit" type="text" @click="editCurrentChpater(scope.$index, scope.row)">编辑</el-button>
            <el-button v-if="scope.row.index === lastindex - 1" type="text" @click="getDelRow(scope.$index, scope.row)">删除</el-button>
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
    <!-- 分页 -->
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
        bookId: '',
        bookData: [],
        dialogTableVisible: false,
        dialogFormVisible: false,
        dialogBookChapterVisible: false,
        formLabelWidth: '100px',
        bookForm: {},
        loading: true,
        chapterData: [],
        currentPageSave: 1,
        count: 0,
        lastindex: 0,
        dialogVisible: false,
        delIndex: 0,
        currentRows: "",
        showCurrentChapter: {
          title: '',
          content: '',
          index: ''
				},
				current_page: 1,
      };
    },
    created() {
      this.getId()
      this.getBookInfo()
      this.getAllChapterInfo()
    },
    methods: {
      getId() {
        this.bookId = this.$route.params.bookid
      },
      getBookInfo() {
        this.$axios.get(`/book/${this.bookId}`)
          .then((results) => {
            this.bookData.push(results.data)
            this.bookForm = results.data
						this.loading = false
          })
      },
      updateBookInfo() {
        this.dialogFormVisible = false
        this.$axios.put(`/book/${this.bookId}`, this.bookForm)
          .then(results => {
            console.log(results.data);
            this.$message({
              message: '修改成功',
              type: 'success'
            });
          })
          .catch(() => {
            this.$message.error('错了哦，这是一条错误消息');
          })
      },
      // 获取所有章节信息
      getAllChapterInfo() {
        this.$axios
          .get(`/book/${this.bookId}/chapter`)
          .then((result) => {
            this.chapterData = result.data.rows
            this.count = result.data.count
						this.lastindex = this.count + 1
          })
      },
      // 添加书的章节信息, 标题, 内容等
      addBookChpater() {
        this.$router.push({
          path: `/bookchapter/?bookid=${this.bookId}&currentIndex=${this.lastindex}`
        })
      },
      // 获取点击的删除行
      getDelRow(index, rows) {
        console.log(rows.index, this.lastindex - 1)
        this.dialogVisible = true
        this.delIndex = index
        this.currentRows = rows
      },
      // 删除点击的当前行
      deleteRow() {
        this.dialogVisible = false
        this.chapterData.splice(this.delIndex, 1);

        this.$axios.delete(`/book/${this.bookId}/chapter?index=${this.lastindex - 1}`)
          .then((res) => {
            this.$message('删除成功')
						this.current_page = 1
          })
          .catch((error) => {
            this.$message.error('错了哦，这是一条错误消息');
          })

      },
      // 获取章节标题及内容
      showChapterInfo(index, rows) {
        this.$axios
          .get(`/chapter/${rows.id}`)
          .then(result => {
            this.dialogBookChapterVisible = true
            this.showCurrentChapter = {
              title: result.data.title,
              content: result.data.content,
              index: result.data.index
            }
          })
          .catch((error) => {
            this.$message.error('错了哦，这是一条错误消息');
          })
      },
      // 编辑章节信息
      editCurrentChpater(index, rows) {
        console.log(rows)
        this.$router.push({
          path: `/bookchapter/?bookid=${this.bookId}&currentIndex=${rows.index}&chapterid=${rows.id}`,
        })
      },
      // 分页
      handleCurrentChange(val) {
				this.currentPageSave = val
				this.current_page = val
        this.$axios
          .get(`/book/${this.bookId}/chapter?offset=${(val-1)}`)
          .then((results) => {
            this.chapterData = results.data.rows
          })
          .catch((error) => {
            this.$message.error('错了哦，这是一条错误消息');
          })

      },
    },
  }

</script>
