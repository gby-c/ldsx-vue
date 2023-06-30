<script>

export default {
  name: "index",
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ]
      }
    }
  },
  methods: {
    login() {
      // this 代表当前组件实例
      this.$refs.form.validate(valid => {
        if (valid) {
          // this.$message.success("Success!")
          this.$http.get(
              '/user/login',
              {
                params: {
                  'userName': this.form.username,
                  'password': this.form.password
                }
              },
          ).then(res => {
            let result = res.data;
            if (result.status === 200) {
              if (result.data.role !== 1) {
                this.$message.error("无权限");
              } else {
                this.$message.success("登陆成功");
                localStorage.setItem('userInfo', JSON.stringify(result.data));
                this.$router.push('/manage')
              }
            } else {
              this.$message.error(result.msg);
            }
          })
        }
      })
    }
  },
  created() {
    let userInfoStr = localStorage.getItem('userInfo');
    console.log(userInfoStr);
    if (userInfoStr !== null){
      let userInfo = JSON.parse(userInfoStr);
      console.log(userInfo)
      if (userInfo.role === 1) {
        this.$message.success("已登录，跳转中。。。");
        this.$router.push('/manage');
      } else {
        localStorage.removeItem('userInfo');
      }
    }
    let ascll = [
      `Enjoy the hectic and adapt to loneliness 💯`,
      `
       ████████  ████████  ██      ██
      ██         ██     ██ ██      ██
      ██     ███ ████████    ██████
      ██      ██ ██     ██     ██
       ████████  ████████      ██

      ░█▀▀█ ░█▀▀█ ░█──░█
      ░█─▄▄ ░█▀▀▄ ░█▄▄▄█
      ░█▄▄█ ░█▄▄█ ──░█──

      `,
      '©2023 By Gby'
    ];
    console.log('%c%s\n%s\n%s', 'color:#39c5bb', ascll[0], ascll[1], ascll[2]);
  }
}
</script>

<template>
  <div class="container">

    <el-card class="user-card">
      <!--   ref类似于id   -->
      <el-form :model="form" :rules="rules" ref="form" class="user-form">
        <el-form-item>
          <h2>易影后台登录</h2>
        </el-form-item>
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="submit-btn" type="primary" style="width: 50%;" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!--    <div class="advertisement">-->
    <!--      <img src="https://img.zcool.cn/community/01819e5a9e46eca80121958618f795.gif" alt="是兄弟就来砍我！" width="100%" height="100%">-->
    <!--    </div>-->
  </div>

</template>

<style scoped>
.container {
  height: 100%;
  background: url("https://buf.gbyttt.cn/img/202306261553720.jpg") no-repeat center;
  background-size: cover;
  /* 开启弹性布局 默认属性，从左到右 */
  display: flex;
  /* 主轴居中 */
  justify-content: center;
  /* 交叉轴居中 */
  align-items: center;
  flex-direction: column;
}

.user-card {
  height: 42%;
  width: 30%;
  background-color: rgba(255, 255, 255, 0.2);
}

.user-form {
  opacity: 100%;
}

.submit-btn {
  margin-left: 25%;
}

.container h2 {
  text-align: center;
}

</style>