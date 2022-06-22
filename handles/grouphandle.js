const { Middleware } = require('mirai-js')
const at = require("./at")
const shell=require('./shell')
const { qq } = require('../config.json')
const permissionS = {
    'OWNER': "群主",
    'MEMBER': "群员",
    'ADMINISTRATOR': "管理员"
}
module.exports = new Middleware().use((data, next) => {
    data.messageChain = data.messageChain.filter(({ type }) => ['Plain', 'At','Quote'].includes(type))
    data.texts = data.messageChain.filter(({ type }) => type == "Plain").map(({ text }) => text)
    if (data.messageChain.length > 0) { next() }
}).use((data, next) => {
    data.isAtMe = data.messageChain.find((item) => item.type == "At" && item.target == qq) ? true : false
    data.permission = data.sender.permission
    data.permissionText = permissionS[data.sender.permission]
    data.id = data.sender.id
    data.groupId = data.sender.group.id
    data.groupName = data.sender.group.name
    data.memberName = data.sender.memberName
    data.quote=data.messageChain.find((item)=>item.type=="Quote")
    next()
  
}).use(at).use(shell).done()
