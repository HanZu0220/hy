const Discord = require('discord.js');
const User = require('../../utils/user.js');
const { base } = require('../../utils/embed');;
const { hypixel, errors } = require('../../utils/hypixel');
module.exports = {
    name: 'link',
    aliases: [ 'verify' ],
    description: '**將與Hypixel連結您的DC帳號**',
    usage: '`h!link [IGN]`',
    example: '`h!link WipeTeam`',
    async execute(message, args){
      await message.channel.sendTyping()
        const user = await User.findOne({ id: message.author.id });
        if (user && user.uuid) {
          const alreadyconnected = new Discord.MessageEmbed(base)
            .setDescription('**您的帳號已經連接**')
          message.reply({ embeds: [alreadyconnected], allowedMentions: { repliedUser: false } })
        }
        if(!args[0]) {
          const ign404 = new Discord.MessageEmbed(base)
            .setDescription('**你需要輸入一個IGN！ (範例: `h!link WipeTeam`)**')
          message.reply({ embeds: [ign404], allowedMentions: { repliedUser: false } })
        }

        hypixel.getPlayer(args[0]).then(async (player) => {
            if (!player.socialMedia.find((s) => s.id === 'DISCORD')) {
              const notconnected = new Discord.MessageEmbed(base)
                  .setDescription('<a:arrowded:974236415397351424> **你的Hypixel並沒有連接Discord 請查看下方的動畫 按照步驟操作即可**')
                  .setImage('https://thumbs.gfycat.com/DentalTemptingLeonberger-size_restricted.gif')
              return message.reply({ embeds: [notconnected], allowedMentions: { repliedUser: false } })
            }
            if (player.socialMedia.find((s) => s.id === 'DISCORD').link !== message.author.tag) {
              const tagnomatch = new Discord.MessageEmbed(base)
                  .setDescription(`<a:arrowded:974236415397351424> **${player.nickname} 並沒有連接到對應的Discord#0000**`)
              return message.reply({ embeds: [tagnomatch], allowedMentions: { repliedUser: false } })
            }
            const user1 = await User.findOne({ uuid: player.uuid });
            if (user1) {
              const playerdupe = new Discord.MessageEmbed(base)
                  .setDescription('<a:arrowded:974236415397351424> **此名玩家的IGN已經綁定到DC帳號**')
              return message.reply({ embeds: [playerdupe], allowedMentions: { repliedUser: false } })
            }
            new User({
                id: message.author.id,
                uuid: player.uuid
              }).save(() => {
                const linked = new Discord.MessageEmbed(base)
                  .setDescription(`<a:arrowded:974236415397351424> **${player.nickname}已成功連接到您的DC**`)
                message.reply({ embeds: [linked], allowedMentions: { repliedUser: false } })
              });
            }).catch(e => { // error messages
              if (e.message === errors.PLAYER_DOES_NOT_EXIST) {
                  const player404 = new Discord.MessageEmbed(base)
                      .setDescription('<a:arrowded:974236415397351424> **找不到你所想查詢ID的API**')
                  message.reply({ embeds: [player404], allowedMentions: { repliedUser: false } })
              } else if (e.message === errors.PLAYER_HAS_NEVER_LOGGED) {
                  const neverLogged = new Discord.MessageEmbed(base)
                      .setDescription('<a:arrowded:974236415397351424> **這位玩家從未登入過Hypixel**')
                  message.reply({ embeds: [neverLogged], allowedMentions: { repliedUser: false } })
              } else {
                  if (args[0]) {
                      const error = new Discord.MessageEmbed(base)
                          .setDescription('<a:arrowded:974236415397351424> **找不到此名稱**')
                      message.reply({ embeds: [error], allowedMentions: { repliedUser: false } })
                  }
              }       
          });
    }
}