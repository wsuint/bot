const { Message } = require('mirai-js')
const {VM, VMScript} = require('vm2')
const { sendGroupMessage, sendGroupNudge, status } = require('../bot')
const axios = require("axios")
const { masterQQ } = require("../config.json")
const { sleep, textMsg } = require('../utils')
const cheerio = require("cheerio")
const current = {
    groupId: 0,
    id: 0
}
const _send = (message) => {
    sendGroupMessage(current.groupId, message, current.id)
}

const context = {
    *range(start, stop, step = 1) {
        if (stop === undefined) [start, stop] = [0, start];
        for (let i = start; i < stop; i += step) yield i;
    },
    each(num, cb) {
        num = Number(num)
        if (num < 0) {
            for (let i = 0; i > num; i--) {
                cb(i)
            }
        }
        if (num > 0) {
            for (let i = 0; i < num; i++) {
                cb(i)
            }
        }
        if (num = 0) {
            cb(num)
        }
    },
    戳(id) {
        sendGroupNudge(current.groupId, id, current.id)
    },
     async 妹子(){
          const { data } = await axios.get('http://api.wpbom.com/api/picture.php?msg=%E7%BE%8E%E5%A5%B3')
           const message = new Message()

	   message.addImageUrl(data)
          _send(message)
   },
    功能() {
        _send(textMsg(Object.keys(context).join("\n")))
    },
    at(id, msg) {
        const message = new Message()
        message.addAt(id)
        message.addText(String(msg || ""))
        _send(message)
    },
    async 百科(msg) {
        if (!msg) return
        const { data } = await axios.get(`https://baike.baidu.com/item/${encodeURI(msg)}`)
        const $ = cheerio.load(data)
        let s=$(`.para:lt(3)`).text().substring(0, 200).replace(" ","")
        _send(textMsg(s?s:"未找到词条！"))
    },
    output(msg) {
        _send(textMsg(String(msg)))
    }
}
const vm = new VM({
    timeout: 3000,
    sandbox:context
})
const adminContext = {
    ...context,
    on() {
        _send(textMsg(`${status.on ? 'on' : 'off'}-->on`))
        status.on = true
    },
    off() {
        _send(textMsg(`${status.on ? 'on' : 'off'}-->off`))
        status.on = false
    },
    status() {
        _send(textMsg(`${status.on ? 'on' : 'off'}`))
    }
}
const vmAdmin = new VM({
    timeout: 30000,
    sandbox:context
})

const blist=[]
module.exports = async (data, next) => {
    const { isAtMe, permissionText, id, memberName, groupId, groupName, messageChain, texts } = data
    const text = texts.join("").trim("")
    if(blist.includes(id))return
    const prompt = text[0]
    const scriptText = text.substr(1)
    if (!["#", ">"].includes(prompt)) return next()
    current.groupId = groupId
    current.id = id
    if(/require|eval|Function|import/.test(text)){
       _send(textMsg(`检测到危险代码! 已经将${id}加入黑名单! `))
       blist.push(id)
       return
    }
    try {
    if (prompt == "#") {
       if (!masterQQ.includes(id))  throw new Error("权限不足,非BOT管理员请用>作为提示符") 
       vmAdmin.run(scriptText)
    }
    if (prompt == ">") {
       vm.run(scriptText)
    }
    } catch (e) {
        _send(textMsg(String(e) + "\n@我获得帮助 输入>功能()获得函数列表"))
    }
}
