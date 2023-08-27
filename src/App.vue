<template>
  <div v-if="!$store.state.auth">
    <div class="login">
      <Login /> 
    </div>
    <div class="footer">
      <h4 class="footer-text"><a href="http://fssolutions.com.ar" target="_blank">Desarrollado por FSSolutions</a></h4>
    </div>
  </div>
  <div v-else>
    <div class="app">
      <Sidebar />   
      <router-view></router-view>
    </div>
    <div class="footer">
      <h4 class="footer-text"><a href="http://fssolutions.com.ar" target="_blank">Desarrollado por FSSolutions</a></h4>
    </div>
  </div>
  
</template>

<script>
  import Sidebar from './components/Sidebar.vue'
  import Login from './views/login/index.vue'
  
  export default {
    components:{
      Sidebar,
      Login
    } ,
    data() {
      return {
      }
    },

  }
</script>

<style lang="scss">
  :root{
    --primary: #4ade80;
    --primary-alt: #22c55e;
    --grey: #64748b;
    --dark: #1e293b;
    --dark-alt: #334155;
    --light: #f1f5f9;
    --sidebar-width: 300px;
  }

  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Ubuntu', sans-serif;
  }

  body{
    background: var(--light);
  }

  button{
    cursor: pointer;
    appearance: none;
    border: none;
    outline: none;
    background: none;
  }

  .login {
    height: calc(100vh - 32px);
    width: 100% !important;
  }

  .app{
    display: flex;
    height: calc(100vh - 32px);

    main{
      flex: 1 1 0;
      padding: 2rem;

      @media (max-width: 768px){
        padding-left: 6rem;
      }
    }

    
  }

  .footer {
    background: var(--dark);
    height: 32px;
    color: var(--light);
    text-align: center;
    display: flex;
    align-items: center;
    .footer-text {
      margin: auto;
      a {
        text-decoration: none;
        color: var(--light);
      }
      a:hover {
        color: var(--primary-alt);
      }
    }
  }
</style>
