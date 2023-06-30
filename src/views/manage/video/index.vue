<script>

export default {
  name: "index",
  data() {
    return {
      kinds: ['电影', '电视剧', '综艺', '动漫'],
      params: {
        pageNum: 1,
        pageSize: 5,
        videoTitle: null,
        videoKind: null
      },
      total: 0,
      list: [],
      addDialog: false,
      addInfo: {
        id: '',
        videoTitle: '',
        videoCover: '',
        videoTypes: '',
        director: '',
        stars: '',
        publishTime: '',
        videoKind: 1,
        videoPath: '',
        videoContent: '',
        videoStatus: 0,
        doubanScore: 0,
        videoChildrensList: [],
        newChildrens: []
      },
      emptyInfo: {
        id: '',
        videoTitle: '',
        videoCover: '',
        videoTypes: '',
        director: '',
        stars: '',
        publishTime: '',
        videoKind: 1,
        videoPath: '',
        videoContent: '',
        videoStatus: 0,
        doubanScore: 0,
        videoChildrensList: [],
        newChildrens: []
      },
      addFlag: true,
      coverFlag: false,
      newCover: null
    }
  },
  methods: {
    query() {
      this.$http.get('/video/get', {
        params: this.params
      }).then(res => {
        this.list = res.data.data.rows;
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
    delVideo(id) {
      this.$confirm('此操作将永久删除该影视信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('/video/del/video', {
          params: {
            id: id
          }
        }).then(res => {
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
          message: '已取消删除'
        });
      });
    },
    delChild(id) {
      this.$confirm('此操作将永久删除该选集, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('/video/del/child', {
          params: {
            id: id
          }
        }).then(res => {
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
          message: '已取消删除'
        });
      });
    },
    addVideo() {
      this.addInfo = this.emptyInfo
      this.addFlag = true;
      this.addDialog = true;
    },
    updateVideo(row) {
      this.addInfo = row
      this.addFlag = false
      this.addDialog = true;
    },
    editVideo() {
      if (this.addFlag) {
        this.$http.post('/video/add/video', this.addInfo)
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
        this.$http.put('/video/update/video', this.addInfo)
            .then(res => {
              let result = res.data;
              if (result.status === 200) {
                this.$message.success(result.msg);
              } else {
                this.$message.error(result.msg);
              }
            });
      }
      this.addDialog = false;
      this.query();
    },
    updateCover(row) {
      this.addInfo = {...row};
      this.addFlag = true;
      this.coverFlag = true;
    },
    updateCoverSuccess(res, file) {
      this.newCover = 'https://buf.gbyttt.cn/' + res.data.key;
    },
    editCover() {
      if (this.newCover !== "" && this.newCover != null) {
        this.addInfo.videoCover = this.newCover;
        this.addFlag = false;
        this.editVideo();
        this.newCover = "";
        this.coverFlag=false;
      } else {
        this.$message.error("请先上传图片")
      }
    },
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
        <el-form-item label="影视名称">
          <el-input v-model="params.videoTitle" placeholder="请填写影视名称"></el-input>
        </el-form-item>
        <el-form-item label="影视分类">
          <el-select v-model="params.videoKind" placeholder="请选择影视分类" clearable>
            <el-option label="电影" :value="1"></el-option>
            <el-option label="电视剧" :value="2"></el-option>
            <el-option label="综艺" :value="3"></el-option>
            <el-option label="动漫" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryParam">查询</el-button>
          <el-button type="primary" @click="addVideo">添加影视</el-button>
        </el-form-item>
      </el-form>
      <el-table
          :data="list"
          style="width: 100%"
          :header-cell-style="{'text-align': 'center'}">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table
                :data="props.row.videoChildrensList"
                style="width: 100%">
              <el-table-column
                  label="集数/期数"
                  prop="videoAnthology"
                  min-width="160px"
                  align="center">
              </el-table-column>
              <el-table-column
                  label="选集路径"
                  prop="videoPath"
                  min-width="900px"
                  align="center">
              </el-table-column>
              <el-table-column
                  label="操作"
                  min-width="100px"
                  fixed="right"
                  align="center">
                <template slot-scope="scope">
                  <el-button type="text" size="small">编辑</el-button>
                  <el-button type="text" size="small" style="color: red" @click="delChild(scope.row.id)">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column
            label="影视封面(点击更换)"
            min-width="80"
            style="text-align: center"
            prop="videoCover"
            align="center">
          <template slot-scope="scope">
            <div class="img">
              <img :src="scope.row.videoCover" alt="" style="height: 100px" @click="updateCover(scope.row)">
            </div>
          </template>
        </el-table-column>
        <el-table-column
            label="影视名称"
            min-width="150"
            prop="videoTitle"
            align="center">
        </el-table-column>
        <el-table-column
            label="影视分类"
            min-width="100"
            prop="videoKind"
            align="center">
          <template slot-scope="scope">
            {{ kinds[scope.row.videoKind - 1] }}
          </template>
        </el-table-column>
        <el-table-column
            label="影视状态"
            min-width="100"
            align="center">
          <template slot-scope="scope">
            {{ scope.row.videoStatus === 1 ? '上映' : '未上映' }}
          </template>
        </el-table-column>
        <el-table-column
            label="上映时间"
            min-width="180"
            prop="publishTime"
            align="center"
            @click="">
        </el-table-column>
        <el-table-column
            label="影视简介"
            min-width="400"
            align="center">
          <template slot-scope="scope">
            {{
              scope.row.videoContent.length > 80 ? scope.row.videoContent.substring(0, 73) + '...' : scope.row.videoContent
            }}
          </template>
        </el-table-column>
        <el-table-column
            label="操作"
            min-width="100px"
            fixed="right"
            align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="updateVideo(scope.row)">编辑</el-button>
            <el-button type="text" size="small" style="color: red" @click="delVideo(scope.row.id)">删除</el-button>
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
        title="影视信息"
        :visible.sync="addDialog"
        width="30%"
    >
      <el-form
          ref="form"
          :model="addInfo">
        <el-form-item label="影视名称">
          <el-input v-model="addInfo.videoTitle"></el-input>
        </el-form-item>
        <el-form-item
            label="影视封面">
          <el-input v-model="addInfo.videoCover"></el-input>
        </el-form-item>
        <el-form-item
            label="影视分类">
          <el-radio-group v-model="addInfo.videoKind">
            <el-radio :label="1">电影</el-radio>
            <el-radio :label="2">电视剧</el-radio>
            <el-radio :label="3">综艺</el-radio>
            <el-radio :label="4">动漫</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
            label="上映情况">
          <el-radio-group v-model="addInfo.videoStatus">
            <el-radio :label="0">暂不上映</el-radio>
            <el-radio :label="1">上映</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
            label="上映时间">
          <el-input v-model="addInfo.publishTime"></el-input>
        </el-form-item>
        <el-form-item>
          <span class="demonstration">豆瓣评分</span>
          <el-slider style="width: 50%; padding-left: 25%" v-model="addInfo.doubanScore" :format-tooltip="function (val){
            return val/10;
          }"></el-slider>
          <!--          <el-input-number v-model="addInfo.doubanScore" :min="0" :max="10"></el-input-number>-->
        </el-form-item>
        <el-form-item
            label="影视简介">
          <el-input type="textarea" v-model="addInfo.videoContent"></el-input>
        </el-form-item>
        <el-form-item
            label="导演">
          <el-input v-model="addInfo.director"></el-input>
        </el-form-item>
        <el-form-item
            label="演员">
          <el-input v-model="addInfo.stars"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="editVideo">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
        title="修改封面"
        :visible.sync="coverFlag"
        width="30%">
      <el-form>
        <el-form-item
            label="原本封面">
          <template>
            <div>
              <img :src="addInfo.videoCover" alt="" style="height: 200px">
            </div>
          </template>
        </el-form-item>
        <el-form-item
            label="上传封面">
          <el-upload
              class="avatar-uploader"
              action="http://localhost:9527/file/upload"
              :show-file-list="false"
              :on-success="updateCoverSuccess">
            <img v-if="newCover" :src="newCover" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="coverFlag=false">取 消</el-button>
        <el-button type="primary" @click="editCover">确 定</el-button>
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

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  height: 200px;
  display: block;
}
</style>