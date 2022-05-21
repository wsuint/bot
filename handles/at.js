const { Message } = require('mirai-js')
const { ruyi_appKey, ruyi_baseUrl, masterQQ ,name,sname,qq} = require('../config.json')
const {textMsg}=require('../utils')
const axios = require('axios')
const { sendGroupMessage,recaMessage} = require('../bot')
module.exports = async (data, next) => {
  const { isAtMe, permissionText, id, memberName, groupId, groupName, messageChain, texts,quote } = data
  if (!isAtMe) return next()
  const text = texts.join("").trim("")
  const message = new Message()
  if (!text) {
    message.addText(`${permissionText}${memberName}你好。
        我的名字叫${name}。不过我还是更喜欢你们叫我的小名：${sname}
        现在你可以@我+信息就可以得到回复
        输入>执行普通权限代码限制时间3000MS
        输入#执行管理员权限代码限制时间30000MS  
        如果有什么反馈信息可以联系我主人QQ：${masterQQ[0]}`)
  }else if(text=="撤回"&&quote){
    if(masterQQ.includes(id)){
      recaMessage(quote.id)
    }
  } else {
    const obj = {
      q: text,
      app_key: ruyi_appKey,
      context: groupId,
      user_id: id,
    }
    const res = await axios.post(ruyi_baseUrl, obj)
    if (res.data.code == 0) {
      res.data.result.intents.forEach(element => {
        const res = element.outputs.find(({ type }) => type == "dialog")
        if (res) {
          message.addText(res.property.text)
        }
      })
    } else {
      message.addText("接口发生错误")
    }
  }
  sendGroupMessage(groupId, message,id)
}
