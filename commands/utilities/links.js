const Discord = require('discord.js')
const { base } = require('../../utils/embed');
module.exports = {
    name: 'links',
    aliases: [ 'invite', 'discord' ],
    description: '**顯示所有有關本機器人的連結**',
    usage: '`hz links`',
    example: '`hz links`',
    async execute(message, args){
        await message.channel.sendTyping()
        const embed = new Discord.MessageEmbed(base)
            .setAuthor('連結', 'https://share.creavite.co/XSCo7CPrzzVY9rQJ.gif')
            .setThumbnail('https://share.creavite.co/XSCo7CPrzzVY9rQJ.gif')
            .setDescription('**[邀請連結](https://discord.com/api/oauth2/authorize?client_id=1014147026038042664&permissions=8&scope=bot)\n[Discord支援群組](https://discord.gg/hzstore)**')

         message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } })
    }
}