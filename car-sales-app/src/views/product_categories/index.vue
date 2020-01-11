<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="95" type="index"></el-table-column>
      <el-table-column label="名字" prop="name"></el-table-column>
      <el-table-column label="主图" width="180" align="center">
        <template slot-scope="scope">
          <img style="width: 120px; max-height:150px;" :src="scope.row.coverImg | filterImg" />
        </template>
      </el-table-column>
      <el-table-column label="描述" prop="descriptions" width="110" align="center"></el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="small" @click="editOne(scope.row)" type="primary">修改</el-button>
          <el-button size="small" @click="delOne(scope.row)" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="changePage"
      background
      layout="prev, pager, next"
      :page-count="pages"
    ></el-pagination>
  </div>
</template>

<script>
import { getList, removeOne } from '@/api/product_categories'
import { serverUrl, defaultImg } from '@/utils/config'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      total: 1,
      pages: 1
    }
  },
  filters: {
    // 过滤图片路径 添加服务器前缀
    filterImg(val) {
      if (val) {
        if (val.startsWith('http')) {
          return val
        } else {
          return serverUrl + val
        }
      }
      return defaultImg
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData(page = 1) {
      this.listLoading = true
      getList(page).then(response => {
        this.list = response.categories
        // console.log(response)
        this.total = response.totalCount
        this.pages = response.pages
        this.listLoading = false
      })
    },
    editOne(item) {
      this.$router.push({
        name: 'ProductCategoryEdit',
        query: {
          id: item._id
        }
      })
    },
    delOne(item) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          removeOne(item._id).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.fetchData()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    changePage(p) {
      // console.log(p)
      this.fetchData(p)
    }
  }
}
</script>
