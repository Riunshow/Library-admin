<style lang="css" scoped>
img {
	margin-top: 10px;
}
</style>
<template>
	<div id="userinfo">
		 <el-table :data="userData" style="width: 100%">
			<el-table-column label="头像" width="100">
                 <template slot-scope="scope">
                     <img :src="userData[0].avatar" width="40" height="40"/>
                 </template>
            </el-table-column>
			<el-table-column
				prop="nickname"
				label="姓名"
				width="180">
			</el-table-column>
			<el-table-column
				prop="integral"
				label="积分">
			</el-table-column>
			<el-table-column
				prop="readingTime"
				label="阅读时长">
			</el-table-column>
			<el-table-column label="操作" prop="">
				<template slot-scope="scope">
					<el-button type="text" @click="dialogFormVisible = true">修改</el-button>
					<el-dialog title="用户信息" :visible.sync="dialogFormVisible">
						<el-form :model="userForm">
							<el-form-item label="头像" :label-width="formLabelWidth">
								<el-input v-model="userForm.avatar" auto-complete="off"></el-input>
							</el-form-item>
							<el-form-item label="姓名" :label-width="formLabelWidth">
								<el-input v-model="userForm.nickname" auto-complete="off"></el-input>
							</el-form-item>
						</el-form>
						<div slot="footer" class="dialog-footer">
							<el-button @click="dialogFormVisible = false">取 消</el-button>
							<el-button type="primary" @click="updateUserInfo">确 定</el-button>
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
		userId: '',
		userData: [],
		dialogTableVisible: false,
		dialogFormVisible: false,
		formLabelWidth: '100px',		
        userForm: {},
	};
  },
  created () {
	this.getId()  
	this.getUserInfo()
  },
  methods: {
	  	getId() {
		  this.userId = this.$route.params.userid
	  	},
	  	getUserInfo() {
			const _this = this
		//   axios.get(`/user/info/${this.userId}`)
		  axios.get('/user/info/' + this.userId)
		  	.then((results) => {
				_this.userData.push(results.data.data)
				_this.userForm = {
					avatar: results.data.data.avatar,
					nickname: results.data.data.nickname,
				}
			})
			.catch((err) => {
				_this.$message.error('查询失败')
			})

		  },
		  updateUserInfo() {
			this.dialogFormVisible = false
			const _this = this
			if (this.userForm.avatar == null || this.userForm.nickname == null ) {
				_this.$message.error('不能为空')
			}else{
				axios.put('/user/info/' + this.userId, _this.userForm)
					.then(results => {
						_this.userData[0].avatar = _this.userForm.avatar
						_this.userData[0].nickname = _this.userForm.nickname
					})
			}

		  },
	},
  }
</script>
