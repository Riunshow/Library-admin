<template>
	<div>
		<el-input placeholder="请输入用户名" v-model="user_name" clearable />
		<el-input placeholder="请输入密码" v-model="user_pwd" clearable />
		<el-button round @click="login">圆形按钮</el-button>
	</div>
</template>

<script>
	import axios from 'axios'
	import store from "./../store"
	export default {
		data() {
			return {
				user_name: '',
				user_pwd: '',
			};
		},
		methods: {
			login() {
				const _this = this

				axios.post('/login', {
					user_name: this.user_name
				}).then(results => {
					const userData = {
						name: results.data.username,
						role: results.data.role
					}
					store.commit("login", userData);
					_this.$router.push("/index");
				})
			}
		}
	}
</script>

<style lang="css" scoped>

</style>