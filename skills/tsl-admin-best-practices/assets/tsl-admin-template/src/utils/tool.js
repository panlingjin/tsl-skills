export function bem(block, element) {
  return element ? `${block}-${element}` : block
}

export function formatDate(value) {
  if (!value) return '-'
  return String(value)
}

export function findKeyByPath(menuList, path, field = 'key') {
  let result = ''

  function walk(list) {
    if (!Array.isArray(list) || result) return

    list.forEach((item) => {
      if (result) return
      const activePath = item.activePath || item.path
      if (activePath && (path === activePath || (activePath !== '/' && path.startsWith(`${activePath}/`)))) {
        result = item[field]
        return
      }
      walk(item.children)
    })
  }

  walk(menuList)
  return result
}
