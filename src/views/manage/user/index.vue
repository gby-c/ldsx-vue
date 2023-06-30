<script>
export default {
  name: "index",
  data() {
    return {
      kinds: ['用户', '管理员'],
      params: {
        pageNum: 1,
        pageSize: 5,
        userName: null,
        role: null
      },
      total: 0,
      list: [],
      addDialog: false,
      addInfo: {
        userName: "",
        password: "",
        userPic: "",
        userCover: "",
        sex: "",
        content: "",
        age: 0,
        openid: "",
        role: 0,
        activate: 1

      },
      emptyInfo: {
        userName: "",
        password: "",
        userPic: "",
        userCover: "",
        sex: "",
        content: "",
        age: 0,
        openid: "",
        role: 0,
        activate: 1
      },
      addFlag: true
    }
  },
  methods: {
    query() {
      this.$http.get('/user/select', {
        params: this.params
      }).then(res => {
        this.list = res.data.data.rows;
        console.log(this.list)
        this.total = res.data.data.total;
      })
    },
    queryParam() {
      this.params.pageNum = 1
      this.query()
    },
    handleSizeChange(val) {
      this.params.pageSize = val
      this.query()
    },
    handleCurrentChange(val) {
      this.params.pageNum = val
      this.query()
    },
    banUser(row) {
      console.log(row)
      this.$confirm('此操作将' + (row.activate === 1  ? '封禁' : '解封') + '该账户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.put('/user/ban', row).then(res => {
          let result = res.data
          if (result.status === 200) {
            this.$message.success(result.msg);
            this.queryParam();
          } else {
            this.$message.error(result.msg);
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    addUser() {
      this.addInfo = this.emptyInfo
      this.addFlag = false;
      this.addDialog = true;
    },
    updateUser(row) {
      this.addInfo = row
      this.addFlag = true;
      this.addDialog = true;
    },
    editUser() {
      if (this.addFlag) {
        this.$http.put('/user/update/user', this.addInfo)
            .then(res => {
              let result = res.data
              if (result.status === 200) {
                this.$message.success(result.msg)
                this.query()
              } else {
                this.$message.error(result.msg)
              }
            });
      } else {
        this.addInfo.password = '123456';
        this.$http.post('/user/register', this.addInfo)
            .then(res => {
              let result = res.data;
              if (result.status === 200) {
                this.$message.success(result.msg+"\n初始密码为123456");
              } else {
                this.$message.error(result.msg);
              }
            });
      }
      this.addDialog = false;
      this.query();
    }
  },
  created() {
    this.query();
  }
}
</script>

<template>
  <div class="container">
    <el-card>
      <el-form :inline="true">
        <el-form-item label="账号">
          <el-input v-model="params.userName" placeholder="请填写用户账号" clearable></el-input>
        </el-form-item>
        <el-form-item label="权限">
          <el-select v-model="params.role" placeholder="请选择用户权限" clearable>
            <el-option label="普通用户" :value="0"></el-option>
            <el-option label="管理员" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryParam">查询</el-button>
          <el-button type="primary" @click="addUser">添加用户</el-button>
        </el-form-item>
      </el-form>
      <el-table
          :data="list"
          style="width: 100%"
          :header-cell-style="{'text-align': 'center'}">
        <el-table-column
            label="用户名"
            prop="userName"
            align="center">
        </el-table-column>
        <el-table-column
            label="头像"
            min-width="90"
            style="text-align: center"
            prop="userPic"
            align="center">
          <template slot-scope="scope">
            <div class="img">
              <img :src="scope.row.userPic" alt="" style="height: 100px">
            </div>
          </template>
        </el-table-column>
        <el-table-column
            label="背景图"
            min-width="90"
            style="text-align: center"
            prop="userCover"
            align="center">
          <template slot-scope="scope">
            <div class="img">
              <img :src="scope.row.userCover" alt="" style="height: 100px">
            </div>
          </template>
        </el-table-column>
        <el-table-column
            label="性别"
            min-width="100"
            prop="sex"
            align="center">
        </el-table-column>
        <el-table-column
            label="年龄"
            min-width="100"
            prop="age"
            align="center">
        </el-table-column>
        <el-table-column
            label="个性签名"
            min-width="180"
            prop="content"
            align="center">
        </el-table-column>
        <el-table-column
            label="权限"
            align="center">
          <template slot-scope="scope">
            {{
              scope.row.role === 1 ? '管理员' : '用户'
            }}
          </template>
        </el-table-column>
        <el-table-column
            label="状态"
            align="center">
          <template slot-scope="scope">
            {{
              scope.row.activate === 1 ? '正常' : '封禁'
            }}
          </template>
        </el-table-column>
        <el-table-column
            label="操作"
            min-width="100px"
            fixed="right"
            align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="updateUser(scope.row)">编辑</el-button>
            <el-button type="text" size="small" style="color: red" @click="banUser(scope.row)">
              {{ scope.row.activate === 1 ? '封禁' : '解封' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          style="margin-top: 20px"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="params.pageNum"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="5"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>
    <el-dialog
        title="账户信息"
        :visible.sync="addDialog"
        width="30%"
    >
      <el-form
          ref="form"
          :model="addInfo">
        <el-form-item label="用户名">
          <el-input v-model="addInfo.userName"></el-input>
        </el-form-item>
        <el-form-item
            label="头像">
          <el-input v-model="addInfo.userPic"></el-input>
        </el-form-item>
        <el-form-item
            label="背景图">
          <el-input v-model="addInfo.userCover"></el-input>
        </el-form-item>
        <el-form-item
            label="性别">
          <el-radio-group v-model="addInfo.sex">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
            label="年龄">
          <el-input-number v-model="addInfo.age" :min="0" :max="130"></el-input-number>
        </el-form-item>
        <el-form-item
            label="个性签名">
          <el-input type="textarea" v-model="addInfo.content"></el-input>
        </el-form-item>
        <el-form-item
            label="是否为管理员">
          <el-radio-group v-model="addInfo.role">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
            label="openid">
          <el-input v-model="addInfo.openid" disabled></el-input>
        </el-form-item>
        <el-form-item
            label="状态">
          <el-radio-group v-model="addInfo.activate">
            <el-radio :label="0">封禁</el-radio>
            <el-radio :label="1">正常</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.img {
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-table-column {
  text-align: center;
}
</style>