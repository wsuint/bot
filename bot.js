const { Bot } = require('mirai-js')
const schedule = require("node-schedule")
const { masterQQ } = require('./config.json')
const { now, sleep } = require('./utils')
const Gueue=require("./gueue.js")
const gueues=[]
const adminGueue=new Gueue(10,-1)
adminGueue.start()
const bot = new Bot()
const status = {
    on: true,
}
const completeMessages = []
const sendGroupMessage = async (group, message, id) => {
    const admin = masterQQ.includes(id)
    const action = async () => bot.sendMessage({ group, message }) 
    action.group = group
    if (admin) {
       adminGueue.push(action)
    } else {
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
    
    const action = async () => bot.sendNudge({ group, target })     
    action.group = group
    if (admin) {
        adminGueue.push(action)
    } else {
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
const recaAllGroupMessage = async (id) => {
    for (const message of completeMessages) {
        const { messageId, group } = message
        if (group != id || !messageId) return
        await bot.recall({ messageId })
        delete message
        await sleep(500)
    }
}
const recaMessage = async (messageId) => {
    await bot.recall({ messageId })
}

const send = async action => {
    const messageId = await action()
    completeMessages.push({ messageId, group: action.group, time: now() })
    return action
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
    recaAllGroupMessage,
    sendGroupNudge,
    sendMessage,
    recaMessage,
    status,
}


