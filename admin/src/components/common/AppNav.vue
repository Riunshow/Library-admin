<!-- 左侧菜单导航栏组件 -->
<template>
  <div class="app-nav-wrap">
    <el-menu :default-active="$route.path" class="el-menu-vertical-demo" router>
      <el-menu-item v-for="menu in menus" :index="menu.route" :key="menu.route">
        <i class="el-icon-menu" /> {{menu.name}}
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
  import store from './../../store/index'
  export default {
    data() {
      return {
        menus: [],
        menus1: [{
            route: '/index',
            name: '首页'
          },
          {
            route: '/book',
            name: '图书管理'
          },
          {
            route: '/personal',
            name: '个人中心'
          }
        ],
        menus2: [{
            route: '/index',
            name: '首页'
          },
          {
            route: '/book',
            name: '图书管理'
          },
          {
            route: '/user',
            name: '用户管理',
          },
          {
            route: '/group',
            name: '分组管理',
          },
          {
            route: '/personal',
            name: '个人中心'
          }
        ],
      }
    },
    created() {
      this.isAdmin()
    },
    mounted() {
      // 刷新时以当前路由做为tab加入tabs
      if (this.$route.path !== '/index' && this.$route.path.indexOf('userInfo') == -1) {
        this.$store.commit('add_tabs', {
          route: '/index',
          name: '首页'
        });
        this.$store.commit('add_tabs', {route: this.$route.path , name: this.$route.name });
        this.$store.commit('set_active_index', this.$route.path);
      } else {
        this.$store.commit('add_tabs', {
          route: '/index',
          name: '首页'
        });
        this.$store.commit('set_active_index', '/index');
        this.$router.push('/index');
      }
    },
    computed: {
      options() {
        return this.$store.state.options;
      }
    },
    methods: {
      isAdmin() {
        const role = sessionStorage.user_role
        if(role == 10) {
          this.menus = this.menus1
        }else if(role == 20) {
          this.menus = this.menus2
        }
      }
    }
  }
</script>
