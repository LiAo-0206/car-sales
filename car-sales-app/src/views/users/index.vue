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
      <el-table-column label="用户名" prop="userName"></el-table-column>
      <el-table-column label="头像" width="180" align="center">
        <template slot-scope="scope">
          <img style="width: 120px; max-height:150px;" :src="scope.row.avatar | filterImg" />
        </template>
      </el-table-column>
      <el-table-column label="昵称" prop="nickName" width="110" align="center"></el-table-column>
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
import { getList } from '@/api/user'
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
        this.list = response.users
        // console.log(response)
        this.total = response.totalCount
        this.pages = response.pages
        this.listLoading = false
      })
    },
    changePage(p) {
      // console.log(p)
      this.fetchData(p)
    }
  }
}
</script>
