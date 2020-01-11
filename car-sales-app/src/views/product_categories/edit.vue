<template>
  <div class="app-container">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="名字" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="主图">
        <!--
          action 表示上传的地址
          on-success 表示成功的回调函数
          before-upload 表示上传之前
        -->
        <el-upload
          class="avatar-uploader"
          :action="uploadUrl"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="描述">
        <el-input type="textarea" v-model="ruleForm.descriptions"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即修改</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { one, update } from '@/api/product_categories'
import { serverUrl } from '@/utils/config'
export default {
  data() {
    return {
      ruleForm: {
        name: '',
        descriptions: '',
        coverImg: ''
      },
      imageUrl: '',
      uploadUrl: serverUrl + '/api/v1/common/file_upload',
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
          //   { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    one(this.$route.query.id).then(res => {
      this.ruleForm.name = res.name
      this.ruleForm.descriptions = res.descriptions
      this.ruleForm.coverImg = res.coverImg
      if (res.coverImg) {
        if (res.coverImg.startsWith('http')) {
          this.imageUrl = res.coverImg
        } else {
          this.imageUrl = serverUrl + res.coverImg
        }
      }
    })
  },
  methods: {
    handleAvatarSuccess(res, file) {
      // console.log(res, file)
      this.imageUrl = URL.createObjectURL(file.raw)
      this.ruleForm.coverImg = res.info // 把图片上传之后的服务器路径存入数据库
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // alert('submit!')
          update(this.$route.query.id, this.ruleForm).then(() => {
            this.$router.push({
              name: 'ProductCategoriesList'
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
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
  max-width: 178px;
  max-height: 178px;
  display: block;
}
</style>