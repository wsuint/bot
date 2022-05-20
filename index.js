const { bot } = require('./bot')
const { qq, baseUrl, verifyKey } = require('./config.json')
const grouphandle = require('./handles/grouphandle')
const friendhandle = require('./handles/friendhandle')
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