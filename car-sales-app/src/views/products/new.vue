<template>
  <div class="app-container">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="商品名字" prop="name">
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
      <el-form-item label="商品分类" prop="productCategory">
        <el-select placeholder="请选择分类" v-model="ruleForm.productCategory">
          <el-option :label="c.name" v-for="c in categories" :key="c._id" :value="c._id">{{c.name}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="价格">
        <el-input v-model="ruleForm.price"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { create } from '@/api/products'
import { getList } from '@/api/product_categories'
import { serverUrl } from '@/utils/config'
export default {
  data() {
    return {
      ruleForm: {
        name: '',
        price: 0,
        coverImg: '',
        productCategory: ''
      },
      imageUrl: '',
      uploadUrl: serverUrl + '/api/v1/common/file_upload',
      categories: [],
      rules: {
        name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        productCategory: [
          { required: true, message: '请选择分类', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    // 获取商品分类信息
    getList(1, 100).then(res => {
      this.categories = res.categories
    })
  },
  methods: {
    handleAvatarSuccess(res, file) {
      // console.log(res, file)
      this.imageUrl = URL.createObjectURL(file.raw)
      this.ruleForm.coverImg = res.info // 把图片上传之后的服务器路径存入数据库
    },
    // beforeAvatarUpload(file) {
    //   const isJPG = file.type === 'image/jpeg'
    //   const isLt2M = file.size / 1024 / 1024 < 2

    //   if (!isJPG) {
    //     this.$message.error('上传头像图片只能是 JPG 格式!')
    //   }
    //   if (!isLt2M) {
    //     this.$message.error('上传头像图片大小不能超过 2MB!')
    //   }
    //   return isJPG && isLt2M
    // },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // alert('submit!')
          create(this.ruleForm).then(res => {
            this.$router.push({
              name: 'ProductsList'
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
  width: 178px;
  height: 178px;
  display: block;
}
</style>