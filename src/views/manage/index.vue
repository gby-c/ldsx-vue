<script>
export default {
  name: "index",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.passwdForm.checkPass !== '') {
          this.$refs.passwdForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.passwdForm.newPasswd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      user: {},
      passwdFlag: false,
      passwdForm: {
        oldPasswd: '',
        newPasswd: '',
        checkPass: ''
      },
      rules: {
        oldPasswd: [
          {
            trigger: 'blur',
            message: "请输入旧密码",
            required: true,
          }
        ],
        newPasswd: [
          {
            trigger: 'blur',
            required: true,
            validator: validatePass
          }
        ],
        checkPass: [
          {
            trigger: 'blur',
            required: true,
            validator: validatePass2
          }
        ]
      }
    }
  },
  methods: {
    quit() {
      localStorage.removeItem('userInfo');
      this.$message.success("退出成功");
      this.$router.push('/')
    }
    ,
    editPasswd() {
      this.$refs.passwdForm.validate(valid => {
        if (valid) {
          let userInfo = {...this.user}
          userInfo.password = this.passwdForm.oldPasswd
          userInfo.newPasswd = this.passwdForm.newPasswd
          this.$http.put('/user/update/passwd', userInfo)
              .then(res => {
                let result = res.data;
                if (result.status === 200) {
                  this.passwdFlag=false;
                  localStorage.removeItem('userInfo');
                  this.$message.success("修改成功，请重新登录");
                  this.$router.push('/')
                } else {
                  this.$message.error(result.msg);
                }
              })
        }
      })
      // console.log(this.passwdForm)
    }
  },
  created() {
    let userStr = localStorage.getItem('userInfo')
    if (userStr) {
      this.user = JSON.parse(userStr);
    } else {
      this.$message.error("请先去登录");
      this.$router.push('/');
    }
  }
}
</script>

<template>
  <div class="container">
    <el-container>
      <el-aside width="15%">
        <el-menu router
                 default-active="/video/list"
                 background-color="#1A1D1E"
                 style="height: 100%"
        >
          <div class="title">
            <div class="iconfont icon-yingshi" style="font-size: 25px; color: #63A9FF"></div>
            <div class="title-text">影视后台管理</div>
          </div>
          <el-submenu index="/video">
            <template slot="title">
              <i class="el-icon-video-camera-solid"></i>
              <span class="menu-title">影视管理</span>
            </template>
            <el-menu-item index="/video/list">
              <i class="el-icon-video-camera-solid"></i>
              <span class="menu-title">视频管理</span>
            </el-menu-item>
            <el-menu-item index="/video/shortVideo">
              <i class="el-icon-video-camera-solid"></i>
              <span class="menu-title">微视管理</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="/video">
            <template slot="title">
              <i class="el-icon-user-solid"></i>
              <span class="menu-title">人员管理</span>
            </template>
            <el-menu-item index="/user">
              <i class="el-icon-user-solid"></i>
              <span class="menu-title">账号信息</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <el-dropdown>
            <span class="el-dropdown-link">
              <span>欢迎{{ ' ' + user.userName + ' ' }}管理员</span>
              <el-avatar size="small" :src="user.userPic"></el-avatar>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-key" @click.native="passwdFlag=true">更改密码</el-dropdown-item>
              <el-dropdown-item icon="el-icon-switch-button" @click.native="quit">退出系统</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
    <el-dialog
        title="更改密码"
        :visible.sync="passwdFlag"
        width="30%">
      <el-form :model="passwdForm" :rules="rules" ref="passwdForm">
        <el-form-item label="旧密码" prop="oldPasswd">
          <el-input type="password" v-model="passwdForm.oldPasswd" show-password></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPasswd">
          <el-input type="password" v-model="passwdForm.newPasswd" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="passwdForm.checkPass" show-password></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="passwdFlag=false">取 消</el-button>
        <el-button type="primary" @click="editPasswd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.container, .el-container {
  height: 100%;
  width: 100%;
}

.el-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: #1A1D1E;
  border-bottom: 1px solid #ccc;
}

.el-dropdown-link {
  display: flex;
  align-items: center;
}

.el-dropdown-link span {
  font-size: 14px;
  color: #63A9FF;
  font-weight: 500;
  padding-right: 10px;
}

.title {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
}

.title .title-text {
  padding-left: 15px;
  font-size: 20px;
  color: #63A9FF;
}

.menu-title {
  color: #9CA1A6;
  font-size: 15px;
//display: flex; //align-items: center;
}
</style>