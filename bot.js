const { Bot } = require('mirai-js')
const schedule = require("node-schedule")
const { masterQQ } = require('./config.json')
const { now, sleep } = require('./utils')
const bot = new Bot()
const status = {
    on: true,
}
const completeMessages = []
const groupQueue = {}
const masterQueue = []
const sendGroupMessage = async (group, message, id) => {
    const admin = masterQQ.includes(id)
    const action = async () => { return bot.sendMessage({ group, message }) }
    action.group = group
    if (admin) {
        masterQueue.push(action)
    } else {
        const key = `${group}::${id}`
        let gueue = groupQueue[key]
        if (!gueue) gueue = groupQueue[key] = []
        gueue.push(action)
        if (gueue.length > 5) gueue.length = 5
    }
}
const sendGroupNudge = async (group, target, id) => {
    const admin = masterQQ.includes(id)
    const action = async () => { return bot.sendNudge({ group, target }) }


    action.group = group
    if (admin) {
        masterQueue.push(action)
    } else {
        const key = `${group}::${id}`
        let gueue = groupQueue[key]
        if (!gueue) gueue = groupQueue[key] = []
        gueue.push(action)
        if (gueue.length > 5) gueue.length = 5
    }
}
const recaAllGroupMessage = async (id) => {
    for (const message of completeMessages) {
        const { messageId, group } = message
        if (group != id || !messageId) return
        console.log(messageId)
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
setImmediate(async () => {
    while (true) {
        for (const queue of Object.values(groupQueue)) {
            const action = queue.shift()
            if (action && status.on) {
                await send(action)
            }
        }
        completeMessages.forEach(message => {
            const { time } = message
            if (now() - time > 1000 * 120) {
                delete message
            }
        })
        await sleep(1000)
    }
})
setImmediate(async () => {
    while (true) {
        const action = masterQueue.shift()
        if (action) {
            await send(action)
        }
        await sleep(10)
    }
})
module.exports = {
    bot,
    sendGroupMessage,
    recaAllGroupMessage,
    sendGroupNudge,
    sendMessage,
    recaMessage,
    status,
}


