const { Message } = require('mirai-js')
const now = () => new Date().getTime()
const sleep = time => new Promise(r => setTimeout(r, time))
const textMsg=(text)=> new Message().addText(text)
module.exports = {
    now,
    sleep,
    textMsg
}
