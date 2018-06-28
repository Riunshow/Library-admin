<style lang="css" scoped>
img {
	margin-top: 10px;
}
</style>
<template>
	<div id="bookinfo">
		 <el-table :data="bookData" style="width: 100%" v-loading="loading">
			<el-table-column label="图片" width="100">
                 <template slot-scope="scope">
                     <img :src="scope.row.cover" width="40" height="40"/>
                 </template>
            </el-table-column>
			<el-table-column
				prop="name"
				label="书名"
				width="100">
			</el-table-column>
			<el-table-column
				prop="author"
				label="作者"
				width="100">
			</el-table-column>
			<el-table-column
				prop="company"
				label="出版社"
				width="150">
			</el-table-column>
			<!-- <el-table-column
				prop="numeration"
				label="图书编号"
				width="150">
			</el-table-column> -->
			<el-table-column
				prop="blurb"
				label="图书简介"
				width="450">
			</el-table-column>
			<el-table-column
				prop="pdate"
				label="出版时间"
				width="100">
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
	</div>
</template>

<script>
export default {
  data () {
	return {
		bookId: '',
		bookData: [],
		dialogTableVisible: false,
		dialogFormVisible: false,
		formLabelWidth: '100px',		
		bookForm: {},
		loading: true,
	};
  },
  created () {
	this.getId()  
	this.getBookInfo()
  },
  methods: {
	  	getId() {
		  this.bookId = this.$route.params.bookid
	  	},
	  	getBookInfo() {
			const _this = this
		  	this.$axios.get(`/book/${this.bookId}`)
		  		.then((results) => {
					_this.bookData.push(results.data)
					_this.bookForm = results.data
					this.loading = false
			  	})
		  },
		  updateBookInfo() {
			this.dialogFormVisible = false
			this.$axios.put(`/book/${this.bookId}`,this.bookForm)
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
	},
  }
</script>
