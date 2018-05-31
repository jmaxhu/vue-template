<template>
  <div class="login-container">
    <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
      <div class="title-container">
        <h3 class="title">{{ title }}</h3>
      </div>
      <el-form-item prop="userName">
        <span class="svg-container svg-container_login">
          <i class="fas fa-user fa-xs"></i>
        </span>
        <el-input name="userName" type="text" v-model="loginForm.userName" autoComplete="on" placeholder="用户名" />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <i class="fas fa-lock"></i>
        </span>
        <el-input name="password" :type="passwordType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on" placeholder="密码" />
        <span class="show-pwd" @click="showPwd">
        </span>
      </el-form-item>

      <el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading" @click.native.prevent="handleLogin">登录</el-button>
    </el-form>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import userTypes from '@/store/types/user'

export default {
  name: 'login',
  data () {
    return {
      loginForm: {
        userName: '',
        password: ''
      },
      loginRules: {
        userName: [{ required: true, trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur' }]
      },
      passwordType: 'password',
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'title'
    ])
  },
  methods: {
    showPwd () {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    handleLogin () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store.dispatch(userTypes.LOGIN, this.loginForm).then(() => {
            this.loading = false
            this.$router.push({ path: '/home' })
          }).catch((res) => {
            this.loading = false
            const msg = res.response.data.responseStatus.message
            this.$message.error(msg)
          })
        } else {
          return false
        }
        return false
      })
    }
  }
}
</script>

<style lang="less">
@bg:#2d3a4b;
@light_gray:#eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: @light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px @bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="less" scoped>
@bg:#2d3a4b;
@dark_gray:#889aa4;
@light_gray:#eee;

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background: linear-gradient(45deg, @bg, @bg + #222);
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 10px;
    color: @dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      font-weight: 400;
      color: @light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0px;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: @dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
}
</style>
