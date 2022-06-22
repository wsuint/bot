const { bot } = require('./bot')
const { qq, baseUrl, verifyKey } = require('./config.json')
const grouphandle = require('./handles/grouphandle')
const friendhandle = require('./handles/friendhandle')
const axios=require("axios")
const { Message } = require('mirai-js')
const addtext=Message.prototype.addText
Message.prototype.addText=function(text){
 if(text.length>100){
   text.length=100
   text+="\n100字符后被省略......"
 }
 addtext.call(this,text)
 return this
}
axios.interceptors.request.use(config=>config,err=>{
　console.log(err)
})
axios.interceptors.response.use(data=>data,err=>{
　console.log(err)
})
const main = async () => {
    await bot.open({
        baseUrl,
        verifyKey,
        qq,
    })
    bot.on('FriendMessage', friendhandle)
    bot.on('GroupMessage', grouphandle)
}
main()
