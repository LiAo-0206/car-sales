import { get, del, post, put } from '@/utils/request'

/**
 * 获取列表
 * @param {*} page
 * @param {*} per
 */
export function getList(page, per = 10) {
  return get('/api/v1/admin/products', {
    page,
    per
  })
}

/**
 * 根据id删除
 * @param {*} id
 */
export function removeOne(id) {
  return del('/api/v1/admin/products/' + id)
}

/**
 * 创建
 * @param {*} data
 */
export const create = data => post('/api/v1/admin/products', data)

// export function create(data) {
//   return post('/api/v1/admin/products', data)
// }

/**
 * 根据id获取一条记录
 * @param {*} id
 */
export const one = id => get('/api/v1/admin/products/' + id)

/**
 * 根据id修改一条记录
 * @param {*} id
 * @param {*} data
 */
export const update = (id, data) => put('/api/v1/admin/products/' + id, data)
