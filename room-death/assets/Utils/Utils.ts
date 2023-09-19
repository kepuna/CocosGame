

export const createUINode = (name: string = '') => {
    const node = new cc.Node(name)
    return node
}

// 生成唯一标识
export const randomByLength = (len: number) =>
    // 根据len的长度创建一个数组 Array.from()
    // 数组里又个对象 {length:len}，对象有个lenght属性
    // 用 reduce 来迭代出一个字符串
    Array.from({ length: len }).reduce<string>((total: string, item) => total + Math.floor(Math.random() * 10), '')


// 随机范围(生成start到end间的一个随机数)
export const randomByRange = (start: number, end: number) => {
    return Math.floor(start + (end - start) * Math.random())
}

const reg = /\((\d+)\)/
// 从字符串中那数字
const getNumberWithinString = (str: string) => {
    return parseInt(str.match(reg)[1] || '0')
}

// 根据正则，对异步回来的 SpriteFrame ，通过名字进行排序
export const sortSpriteFrame = (spriteFrames: cc.SpriteFrame[]) =>
    spriteFrames.sort((a, b) => getNumberWithinString(a.name) - getNumberWithinString(b.name))
