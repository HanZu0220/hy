const Discord = require('discord.js');
const fs = require('fs');
const { base } = require('../../utils/embed');
module.exports = {
    name: 'help',
    aliases: [ 'commands', 'commandlist' ],
    description: '**顯示所有指令或顯示詳細內容**',
    usage: '`hz help 所想知道內容的指令`',
    example: '`hz help`, `hz help bedwars`',
    async execute(message, args, bot){
        await message.channel.sendTyping()
        if (!args.length) {
            const general = new Discord.MessageEmbed(base)
                .setAuthor('指令列表', 'https://share.creavite.co/XSCo7CPrzzVY9rQJ.gif')
                .addField('Hypixel查詢功能 🎮', '`hz hypixel` \n`hz bedwars` \n`hz skywars` \n`hz duels` \n`hz uhc` \n`hz speeduhc` \n`hz blitzsurvivalgames` \n`hz buildbattle` \n`hz copsandcrims` \n`hz crazywalls` \n`hz megawalls` \n`hz murdermystery` \n`hz smashheroes` \n`hz tntgames` \n`hz vampirez` \n`hz socials` \n`hz link` \n`hz unlink`', true)
                .addField('其他功能 🛠', '`hz help` \n`hz info` \n`hz members` \n`hz ping` \n`hz links` \n`hz clear` \n`hz ban` \n`hz kick` \n`hz suggest` \n`hz coinflip` \n`hz rng`', true)
                .addField('Minecraft ⛏', '`hz namehistory` \n`hz uuid` \n`hz skin` \n`hz server`', true)
                general.setDescription('**`hz help 指令` 可以查看此指令的詳細內容**')
            return message.reply({ embeds: [general], allowedMentions: { repliedUser: false } })
        }

        const command = bot.commands.get(args[0].toLowerCase()) || bot.commands.find(c => c.aliases && c.aliases.includes(args[0].toLowerCase()));

        if (!command) {
	        const command404 = new Discord.MessageEmbed(base)
                .setAuthor('錯誤', 'https://i.imgur.com/OuoECfX.jpeg')
                .setDescription('**這不是有效的指令**')
            return message.reply({ embeds: [command404], allowedMentions: { repliedUser: false } })
        }

        const help = new Discord.MessageEmbed(base)
            .setAuthor('指令解說', 'https://i.imgur.com/OuoECfX.jpeg')
            .setTitle(`hz ${command.name}`)
            .addField('內容', `\`h!${command.name}\` ${command.description}`)
            if (command.aliases) help.addField('通用指令', `\`hz ${command.aliases.join('`, `hz ')}\``)
            help.addField('用法', command.usage)
            help.addField('範例', command.example)
        message.reply({ embeds: [help], allowedMentions: { repliedUser: false } })
    }
}