<template>
	<div class="cateManage">
		<div class="leftuser">
			<el-input v-model="addUser" placeholder="请输入用户分组名"></el-input>
			<el-button round class="addBtn" @click="searchUserCate">查询</el-button>			
			<el-button type="primary" round class="addBtn" @click="addUserCate">添加</el-button>
			<el-table :data="userTableData" id="out-table" v-loading="loading" >
				<template v-for="column in userTableColumns">
					<el-table-column :label="column.label" :prop="column.prop" align="center"/>
				</template>
				<el-table-column label="操作" prop="" class="options" align="center">
					<template scope="scope">
						<el-button type="text" @click="getUserDelRow(scope.$index, scope.row)">删除</el-button>
						<el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
							<span>确认删除?</span>
							<span slot="footer" class="dialog-footer">
								<el-button @click="dialogVisible = false">取 消</el-button>
								<el-button type="danger" @click.native.prevent="deleteUserRow()">确 定</el-button>
							</span>
						</el-dialog>
					</template>
				</el-table-column>
			</el-table>
		</div>
		
		<div class="rightbook">
			<el-input v-model="addBook" placeholder="请输入图书分组名"></el-input>
			<el-button round class="addBtn" @click="searchBookCate">查询</el-button>
			<el-button type="primary" round class="addBtn" @click="addBookCate">添加</el-button>

			<el-table :data="bookTableData" v-loading="loading">
				<el-table-column prop="direction" label="方向" align="center">
				</el-table-column>
				<el-table-column prop="" label="分类" align="center">
					<template scope="scope">
						<el-select v-model="selectCate[scope.$index]" placeholder="请选择" size="small">
							<el-option
								v-for="item in bookTableData[scope.$index].category"
								:key="item.name"
								:label="item.name"
								:value="item.name">
							</el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column label="操作" prop="" class="options" align="center">
					<template scope="scope">
						<el-button type="text" @click="getBookDelRow(scope.$index, scope.row)">删除</el-button>
						<el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
							<span>确认删除?</span>
							<span slot="footer" class="dialog-footer">
								<el-button @click="dialogVisible = false">取 消</el-button>
								<el-button type="danger" @click.native.prevent="deleteBookRow()">确 定</el-button>
							</span>
						</el-dialog>
					</template>
				</el-table-column>
			</el-table>					
			<!-- <el-table :data="bookTableData" id="out-table" v-loading="loading">
				<template v-for="column in bookTableColumns">
					<el-table-column :label="column.label" :prop="column.prop" align="center">
					</el-table-column>
				</template>
				<el-table-column label="操作" prop="" class="options" align="center">
					<template scope="scope">
						<el-button type="text" @click="getBookDelRow(scope.$index, scope.row)">删除</el-button>
						<el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
							<span>确认删除?</span>
							<span slot="footer" class="dialog-footer">
								<el-button @click="dialogVisible = false">取 消</el-button>
								<el-button type="danger" @click.native.prevent="deleteBookRow()">确 定</el-button>
							</span>
						</el-dialog>
					</template>
				</el-table-column>
			</el-table> -->
		</div>

		<div class="resetBtn">
			<el-button type="success" @click="resetAll">重置</el-button>
		</div>
	</div>
	
</template>

<script>
import axios from 'axios'

export default {
  data () {
	return {
			loading: true,
			dialogVisible: false,
			delIndex: 0,
			delRows: 0,
			userTableData: [],
			bookTableData: [],
			addUser: '',
			addBook: '',
			selectCate: ['全部','全部'],

			userTableColumns: [
				{ label: 'id', prop: 'id'},				
				{ label: '用户分组', prop: 'label'},
			],
			bookTableColumns: [               
				{ label: 'id', prop: 'id'},				
				{ label: '方向', prop: 'label'},
				{ label: '分类', prop: 'cate'},
			],
		};
	},
  	created(){
		this.getUserCategory()         
		this.getBookCategory()         
	},
	methods: {
		// 用户
		getUserCategory() {
			const _this = this                
			axios.get('/user/category')
				.then(results => {
					_this.userTableData = results.data
					_this.loading = false
				})
		},
		getUserDelRow(index, rows){
			this.dialogVisible = true
			this.delIndex = index
			this.delRows = rows
		},
		deleteUserRow() {
			this.dialogVisible = false
			this.userTableData.splice(this.delIndex, 1);

			const _this = this

			axios.delete('/user/' + this.delRows.id)
				.then(() => {
					_this.$message('删除成功')
				})
		},
		addUserCate() {
			const _this = this
			if(_this.addUser == '') {
				_this.$message.error('输入不能为空')
			}else {
				axios.post('/user/category/add', {cateName: _this.addUser})
					.then(() => {
						_this.$message('添加成功')
						this.getUserCategory()
					})
					.catch((err) => {
						console.log(err)
						_this.$message.error('出现错误,请刷新再试或联系管理员')						
					})
			}
			 
		},
		searchUserCate() {
			const _this = this
			if(_this.addUser == '') {
				_this.$message.error('输入不能为空')
			}else {
				axios.post('/user/category/search', {cateName: _this.addUser})
					.then((results) => {
						_this.userTableData = []
						_this.$message('查找成功')
						_this.userTableData.push(results.data)
					})
					.catch((err) => {
						console.log(err)
						_this.$message.error('出现错误,请刷新再试或联系管理员')						
					})
			}
		},
		// ---------- 
		// 图书
		getBookCategory() {
			const _this = this                	
			axios.get('/book/category')
				.then(results => {
					_this.bookTableData = results.data
					_this.loading = false
				})
		},
		getBookDelRow(index, rows){
                this.dialogVisible = true
                this.delIndex = index
                this.delRows = rows
		},
		deleteBookRow() {
			this.dialogVisible = false
			this.bookTableData.splice(this.delIndex, 1);

			const _this = this

			axios.delete('/book/'+ this.delRows.id)
				.then(() => {
					_this.$message('删除成功')
				})
		},
		addBookCate() {
			const _this = this
			 axios.post('/book/category/add', {cateName: _this.addBook})
			 	.then(() => {
					if(_this.addBook == '') {
						_this.$message.error('输入不能为空')
					}else {
						_this.$message('添加成功')
						this.getBookCategory()
					}
				 })
				.catch((err) => {
					console.log(err)
					_this.$message.error('出现错误,请刷新再试或联系管理员')						
				})
		},
		searchBookCate() {
			const _this = this
			if(_this.addBook == '') {
				_this.$message.error('输入不能为空')
			}else {
				axios.post('/book/category/search', {cateName: _this.addBook})
					.then((results) => {
						_this.bookTableData = []
						_this.bookTableData.push(results.data)
						_this.$message('查找成功')						
					})
					.catch((err) => {
						console.log(err)
						_this.$message.error('出现错误,请刷新再试或联系管理员')						
					})
			}
		},
		// ************************
		resetAll() {
			this.addBook = ''
			this.addUser = ''
			this.getUserCategory()         
			this.getBookCategory()   
		},
	}
}
</script>

<style lang="css" scoped>

/* .leftuser {
	width: 49%;	
	float: left;
} */
/* .rightbook {
	width: 49%;
	float: left;
	margin-left: 2%;
} */
.cateManage:after {
	content:".";
	clear:both;
	display:block;
	height:0;
	overflow:hidden;
	visibility:hidden;
}

.leftuser {
	width: 70%;	
}
.rightbook {
	width: 70%;	
	margin-top: 15px;
}

.el-input {
	width: 50%;
	margin-bottom: 10px;
}
.addBtn {
	margin-left: 30px;
}
.resetBtn {
	top: 50px;
	position: relative;
	text-align: center;
}
</style>