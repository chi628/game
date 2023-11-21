// 创建一个空的数据对象
const data = {}

// 创建一个Proxy对象
const proxy = new Proxy(data, {
  get(target, property) {
    console.log(`读取属性 ${property}`)
    return target[property]
  },
  set(target, property, value) {
    console.log(`设置属性 ${property} 为 ${value}`)
    target[property] = value
    // 在这里可以添加更新视图的逻辑
    return true
  }
})

// 通过Proxy对象访问和修改数据
proxy.name = 'John' // 设置属性 name 为 'John'
console.log(proxy.name) // 读取属性 name，输出 'John'
