<style lang="css" scoped>
img {
	margin-top: 10px;
}
</style>
<template>
	<div id="userinfo">
		 <el-table :data="userData" style="width: 100%">
			<el-table-column label="头像" width="100">
                 <template scope="scope">
                     <img :src="scope.row.image" width="40" height="40"/>
                 </template>
            </el-table-column>
			<el-table-column
				prop="name"
				label="姓名"
				width="180">
			</el-table-column>
			<el-table-column
				prop="major_class"
				label="专业班级"
				width="180">
			</el-table-column>
			<el-table-column
				prop="integral"
				label="积分">
			</el-table-column>
			<el-table-column
				prop="time"
				label="阅读时长">
			</el-table-column>
			<el-table-column label="操作" prop="">
				<template scope="scope">
					<el-button type="text" @click="dialogFormVisible = true">修改</el-button>
					<el-dialog title="用户信息" :visible.sync="dialogFormVisible">
						<el-form :model="userForm">
							<el-form-item label="姓名" :label-width="formLabelWidth">
								<el-input v-model="userForm.name" auto-complete="off"></el-input>
							</el-form-item>
							<el-form-item label="专业班级" :label-width="formLabelWidth">
								<el-input v-model="userForm.major_class" auto-complete="off"></el-input>
							</el-form-item>
							<el-form-item label="积分" :label-width="formLabelWidth">
								<el-input v-model="userForm.integral" auto-complete="off"></el-input>
							</el-form-item>
							<el-form-item label="阅读时长" :label-width="formLabelWidth">
								<el-input v-model="userForm.time" auto-complete="off"></el-input>
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
		  axios.get('/user/info')
		  	.then((results) => {
				  console.log(results);
				  _this.userData = results.data
				  _this.userForm = results.data[0]
			  })
		  },
		  updateUserInfo() {
			this.dialogFormVisible = false
			const _this = this
			// axios.put(`/user/update/${this.userId}`,{newuserInfo: this.userForm}) 
			axios.put(`/user/update`,{newUserInfo: this.userForm})
				.then(results => {
					console.log(results.data);
				})
		  },
	},
  }
</script>
