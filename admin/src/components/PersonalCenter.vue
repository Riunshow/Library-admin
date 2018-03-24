<template>
	<el-table :data="tableData" style="width: 100%">
		<el-table-column prop="name" label="姓名" width="180">
		</el-table-column>
		<el-table-column prop="role" label="权限" width="180">
		</el-table-column>
		<el-table-column prop="date" label="入职时间">
		</el-table-column>
	</el-table>
</template>

<script>
	export default {
		data() {
			return {
				tableData: [{
					date: '2016-05-02',
					name: '梁启源',
					role: '系统管理员'
				}]
			};
		}
	}
</script>

<style lang="css" scoped>

</style>