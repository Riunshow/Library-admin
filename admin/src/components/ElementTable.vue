<!-- 用户管理组件 -->
<template>
    <div class="user-wrap">
        <el-table
            :data="tableData">
            <template v-for="column in tableColumns">
                <el-table-column
                    :label="column.label"
                    :prop="column.prop">
                </el-table-column>
            </template>
            <el-table-column
                label="操作"
                prop="">
                <template scope="scope">
                    <el-button type="text" @click="onBtnDetailClick(scope.row)">详情</el-button>
                    <el-button type="text">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                tableData: [{
                    date: '2016-05-02',
                    name: '梁启源',
                    identity: '图书管理员'
                  }, {
                    date: '2016-05-04',
                    name: '梁启源',
                    identity: '图书管理员'
                  }, {
                    date: '2016-05-01',
                    name: '梁启源',
                    identity: '图书管理员'
                  }, {
                    date: '2016-05-03',
                    name: '梁启源',
                    identity: '图书管理员'
                  }],
                tableColumns: [
                    { label: '日期', prop: 'date'},
                    { label: '姓名', prop: 'name'},
                    { label: '身份', prop: 'identity'}
                ]
            };
        },
        components: {},
        mounted() {},
        methods: {
            onBtnDetailClick (row) {
                // 1. 用户详情存vuex
                this.$store.commit('save_detail_info', row);
                // 2. 动态改变路由的指向
                this.$router.push({path: `/userInfo/${row.name}`});
            }
        },
        computed: {},
        watch: {}
    };
</script>
