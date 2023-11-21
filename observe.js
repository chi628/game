// 定义观察者类
class Observer {
  constructor() {
    this.subscribers = []
  }

  // 添加订阅者
  subscribe(callback) {
    this.subscribers.push(callback)
  }

  // 取消订阅
  unsubscribe(callback) {
    this.subscribers = this.subscribers.filter((subscriber) => subscriber !== callback)
  }

  // 通知所有订阅者
  notify(data) {
    this.subscribers.forEach((subscriber) => subscriber(data))
  }
}

// 定义双向绑定类
class TwoWayBinding {
  constructor() {
    this.value = ''
    this.observer = new Observer()
  }

  // 设置值
  setValue(value) {
    this.value = value
    this.observer.notify(value)
  }

  // 获取值
  getValue() {
    return this.value
  }

  // 订阅值变化事件
  subscribe(callback) {
    this.observer.subscribe(callback)
  }

  // 取消订阅值变化事件
  unsubscribe(callback) {
    this.observer.unsubscribe(callback)
  }
}

// 创建双向绑定对象
const binding = new TwoWayBinding()

// 订阅值变化事件
binding.subscribe((value) => {
  console.log('值变化了：', value)
})

// 设置值
binding.setValue('Hello, World!')

// 获取值
const value = binding.getValue()
console.log('当前值：', value)
