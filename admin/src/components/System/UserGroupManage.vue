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
					<template slot-scope="scope">
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
			addUser: '',
			selectCate: ['全部','全部'],

			userTableColumns: [
				{ label: 'id', prop: 'id'},				
				{ label: '用户分组', prop: 'label'},
			],
		};
	},
  	created(){
		this.getUserCategory()          
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
		// ************************
		resetAll() {
			this.addBook = ''
			this.addUser = ''
			this.getUserCategory()          
		},
	}
}
</script>

<style lang="css" scoped>
.cateManage:after {
	content:".";
	clear:both;
	display:block;
	height:0;
	overflow:hidden;
	visibility:hidden;
}

.leftuser {
	/* width: 70%;	 */
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