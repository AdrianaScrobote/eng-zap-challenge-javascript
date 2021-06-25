export const pagination = function (
  items: [],
  totalCount: number,
  pageSize: number,
  pageNumber: number
) {
  let result = {}
  let meta = {}

  meta = Object.assign(meta, { pageNumber: pageNumber })
  meta = Object.assign(meta, { pageSize: pageSize })
  meta = Object.assign(meta, { totalCount: totalCount })
  result = Object.assign(result, meta)
  result = Object.assign(result, { listings: items })
  return result
}
