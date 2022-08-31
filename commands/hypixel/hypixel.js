const Discord = require('discord.js');
const { base } = require('../../utils/embed');
const { hypixel, errors } = require('../../utils/hypixel');
const commaNumber = require('comma-number');;
const User = require('../../utils/user');

module.exports = {
    name: 'hypixel',
    aliases: [ "p", "player", "h", "hy" ],
    description: '**顯示所查詢ID的內容**',
    usage: '`hz hypixel [IGN]`',
    example: '`hz hypixel WipeTeam`',
    async execute(message, args) {
        await message.channel.sendTyping()
        const data = await User.findOne({
            id: message.author.id
        });

        if (!data && !args[0]) { // if someone didn't type in ign
            const ign404 = new Discord.MessageEmbed(base)
                .setAuthor('Error', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Error.svg/1200px-Error.svg.png')
                .setDescription('You need to type in a player\'s IGN! (Example: `h!player cxntered`) \nYou can also link your account to do commands without inputting an IGN. (Example: `h!link cxntered`)')
            message.reply({ embeds: [ign404] })
        }

        if (data && !args[0]) {
            var player = data.uuid;
        } else if (args[0]) {
            var player = args[0];
        }

        hypixel.getPlayer(player, { guild: true }).then(async (player) => {
            if (!player.isOnline) {
                playerIsOnline = "下線中"
            } else if (player.isOnline) {
                playerIsOnline = "上線中"
            }

            if (player.mcVersion == null) {
                playerMinecraftVersion = "未知";
            } else if (player.mcVersion != null) {
                playerMinecraftVersion = player.mcVersion;
            }

            if (player.rank == 'Default') {
                playerRank = "無Rank";
            } else if (player.rank != 'Default') {
                playerRank = player.rank;
            }

            const embed = new Discord.MessageEmbed(base)
                .setAuthor('玩家狀態', 'https://i.imgur.com/tRe29vU.jpeg')              
                .setTitle(`[${player.rank}] ${player.nickname}`)
                .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                .addField('Rank', `\`${playerRank}\``, true)
                .addField('等級', `\`${player.level}\``, true)
                .addField('人品', `\`${commaNumber(player.karma)}\``, true)

            if (player.guild !== null && player.guild.tag == null) {
                embed.addField('公會', `\`${player.guild.name}\``)
            }

            if (player.guild !== null && player.guild.tag !== null) {
                embed.setTitle(`[${player.rank}] ${player.nickname} [${player.guild.tag}]`)
                embed.addField('公會', `\`${player.guild.name} [${player.guild.tag}]\``)
            }
            
                embed.addField('主要的MC版本', `\`${playerMinecraftVersion}\``, true)
                embed.addField('第一次登入在', `<t:${Math.ceil(player.firstLoginTimestamp / 1000)}:R>`)
                embed.addField('最近一次登入在', `<t:${Math.ceil(player.lastLoginTimestamp / 1000)}:R>`)
                embed.addField('狀態', `\`${playerIsOnline}\``, true)

            if (player.rank.includes('MVP+')) {
                if (player.plusColor == null) {
                    embed.addField('+的顏色', '`Red`')
                } else {
                    embed.addField('+的顏色', `\`${player.plusColor}\``)
                }
            }

                embed.addField('連接媒體', `請輸入 \`hz socials ${player.nickname}\` 來查看連接的媒體`)

            message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
        }).catch(e => { // error messages
            if (e.message === errors.PLAYER_DOES_NOT_EXIST) {
                const player404 = new Discord.MessageEmbed(base)
                    .setAuthor('錯誤', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Error.svg/1200px-Error.svg.png')
                    .setDescription('<a:arrowded:974236415397351424> **找不到你所想查詢ID的API**')
                message.reply({ embeds: [player404], allowedMentions: { repliedUser: false } })
            } else if (e.message === errors.PLAYER_HAS_NEVER_LOGGED) {
                const neverLogged = new Discord.MessageEmbed(base)
                    .setAuthor('錯誤', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Error.svg/1200px-Error.svg.png')
                    .setDescription('<a:arrowded:974236415397351424> **這位玩家從未登入過Hypixel**')
                message.reply({ embeds: [neverLogged], allowedMentions: { repliedUser: false } })
            } else {
                if (args[0]) {
                    const error = new Discord.MessageEmbed(base)
                        .setAuthor('錯誤', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Error.svg/1200px-Error.svg.png')
                        .setDescription('<a:arrowded:974236415397351424> **找不到此名稱**')
                    message.reply({ embeds: [error], allowedMentions: { repliedUser: false } })
                }
            }       
        });
    }
}