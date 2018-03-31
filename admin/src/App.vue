<template>
  <div id='app'>
    <keep-alive>
      <router-view @userSignIn="userSignIn"></router-view>
    </keep-alive>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        user_name: sessionStorage.user_name,
        user_role: sessionStorage.user_role
      };
    },
    methods: {
      //子组件(register)将用户名传过来
      userSignIn(user_name,user_role) {
        sessionStorage.user_name = user_name;
        sessionStorage.user_role = user_role;
        this.user_name = sessionStorage.user_name;
        this.user_role = sessionStorage.user_role;
      }
    }
  }
</script>

<style lang="css" scoped>
  html,
  body {
    height: 100%;
    margin: 0;
    padding: 0;
    min-width: 1200px;
    min-height: 768px;
  }
  #app {
    height: 100%;
  }
</style>