const { Bot } = require('mirai-js')
const schedule = require("node-schedule")
const { masterQQ } = require('./config.json')
const { now, sleep } = require('./utils')
const Gueue=require("./gueue.js")
const gueues=[]
const adminGueue=new Gueue(50,-1)
adminGueue.start()
const bot = new Bot()
const status = {
    on: true
}
const completeMessages = []
const sendGroupMessage = async (group, message, id) => {
    const admin = masterQQ.includes(id)
    const action = async () =>bot.sendMessage({ group, message }) 
    action.group = group
    if (admin) {
       adminGueue.push(action)
    } else if(status.on){
        const key = `${group}:${id}`
        let gueue=gueues.find(({id})=>id==key)
        if(!gueue){
          gueue=new Gueue(1000,10,key)
          gueue.start()
          gueues.push(gueue)
        }
        gueue.push(action)
    }
}
const sendGroupNudge = async (group, target, id) => {
    const admin = masterQQ.includes(id)
    const action = async () =>bot.sendNudge({ group, target }) 
    action.group = group
    if (admin) {
        adminGueue.push(action)
    } else if(status.on){
        const key = `${group}:${id}`
        let gueue=gueues.find(({id})=>id==key)
        if(!gueue){
          gueue=new Gueue(1000,10,key)
          gueue.start()
          gueues.push(gueue)
        }
        gueue.push(action)
    }
}
const recaMessage = async (messageId) => {
    await bot.recall({ messageId })
}
const sendMessage = (id, message) => {
    bot.sendMessage({
        friend: id,
        message
    })
}
module.exports = {
    bot,
    sendGroupMessage,
    sendGroupNudge,
    sendMessage,
    recaMessage,
    status,
}


