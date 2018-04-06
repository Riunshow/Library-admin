<style lang="css" scoped>
img {
	margin-top: 10px;
}
</style>
<template>
	<div id="bookinfo">
		 <el-table :data="bookData" style="width: 100%">
			<el-table-column label="图片" width="100">
                 <template scope="scope">
                     <img :src="scope.row.image" width="40" height="40"/>
                 </template>
            </el-table-column>
			<el-table-column
				prop="name"
				label="书名"
				width="180">
			</el-table-column>
			<el-table-column
				prop="author"
				label="作者"
				width="180">
			</el-table-column>
			<el-table-column
				prop="category"
				label="图书类型">
			</el-table-column>
			<el-table-column
				prop="press"
				label="出版社">
			</el-table-column>
			<el-table-column
				prop="numeration"
				label="图书编号">
			</el-table-column>
			<el-table-column
				prop="count"
				label="库存数量">
			</el-table-column>
			<el-table-column label="操作" prop="">
				<template scope="scope">
					<el-button type="text" @click="dialogFormVisible = true">修改</el-button>
					<el-dialog title="图书信息" :visible.sync="dialogFormVisible">
						<el-form :model="bookForm">
							<el-form-item label="书名" :label-width="formLabelWidth">
								<el-input v-model="bookForm.name" auto-complete="off"></el-input>
							</el-form-item>
							<el-form-item label="作者" :label-width="formLabelWidth">
								<el-input v-model="bookForm.author" auto-complete="off"></el-input>
							</el-form-item>
							<el-form-item label="图书类型" :label-width="formLabelWidth">
								<el-input v-model="bookForm.category" auto-complete="off"></el-input>
							</el-form-item>
							<el-form-item label="出版社" :label-width="formLabelWidth">
								<el-input v-model="bookForm.press" auto-complete="off"></el-input>
							</el-form-item>
							<el-form-item label="图书编号" :label-width="formLabelWidth">
								<el-input v-model="bookForm.numeration" auto-complete="off"></el-input>
							</el-form-item>
							<el-form-item label="库存数量" :label-width="formLabelWidth">
								<el-input v-model="bookForm.count" auto-complete="off"></el-input>
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
import axios from 'axios'
export default {
  data () {
	return {
		bookId: '',
		bookData: [],
		dialogTableVisible: false,
		dialogFormVisible: false,
		formLabelWidth: '100px',		
        bookForm: {},
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
		//   axios.get(`/book/info/${this.bookId}`)
		  axios.get('/book/info')
		  	.then((results) => {
				  _this.bookData = results.data
				  _this.bookForm = results.data[0]
			  })
		  },
		  updateBookInfo() {
			this.dialogFormVisible = false
			const _this = this
			// axios.put(`/book/update/${this.bookId}`,{newBookInfo: this.bookForm}) 
			axios.put(`/book/update`,{newBookInfo: this.bookForm})
				.then(results => {
					console.log(results.data);
				})
		  },
	},
  }
</script>
