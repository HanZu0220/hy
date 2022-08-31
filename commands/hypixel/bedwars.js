const Discord = require('discord.js');
const mongoose = require('mongoose');
const { base } = require('../../utils/embed');
const { hypixel, errors } = require('../../utils/hypixel');
const commaNumber = require('comma-number');
const User = require('../../utils/user');
module.exports = {
    name: 'bedwars',
    aliases: [ "bw", "b", "床戰" ],
    description: '顯示所查詢ID的床戰戰績',
    usage: '`hz bedwars [IGN]`',
    example: '`hz bedwars WipeTeam`',
    async execute(message, args) {
            await message.channel.sendTyping()
            const data = await User.findOne({
                id: message.author.id
            });

            if (!args[0] && !data) { // if someone didn't type in ign and wasn't verified
                const ign404 = new Discord.MessageEmbed(base)
                    .setAuthor('錯誤', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Error.svg/1200px-Error.svg.png')
                    .setDescription('<a:arrowded:974236415397351424> 你需要輸入一個ID (範例: `hz bedwars WipeTeam`) \n<a:arrowded:974236415397351424> 如果是您的帳號 你可以綁定 (範例: `hz link WipeTeam`)')
                return message.reply({ embeds: [ign404], allowedMentions: { repliedUser: false } })
            }

            if (data && !args[0]) {
                var player = data.uuid;
            } else if (args[0]) {
                var player = args[0];
            }

            hypixel.getPlayer(player).then((player) => {
                const embed = new Discord.MessageEmbed(base)
                    .setAuthor('Bedwars 戰績', 'https://hypixel.net/styles/hypixel-v2/images/game-icons/BedWars-64.png')
                    .setTitle(`[${player.rank}] ${player.nickname}`)
                    .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                    .addField('等級', `\`${player.stats.bedwars.level}✫\``, true)
                    .addField('金幣', `\`${commaNumber(player.stats.bedwars.coins)}\``, true)
                    .addField('總連勝', `\`${commaNumber(player.stats.bedwars.winstreak)}\``, true)
                    .addField('勝利場數', `\`${commaNumber(player.stats.bedwars.wins)}\``, true)
                    .addField('損失場數', `\`${commaNumber(player.stats.bedwars.losses)}\``, true)
                    .addField('WLR', `\`${player.stats.bedwars.WLRatio}\``, true)
                    .addField('擊殺', `\`${commaNumber(player.stats.bedwars.kills)}\``, true)
                    .addField('死亡', `\`${commaNumber(player.stats.bedwars.deaths)}\``, true)
                    .addField('KDR', `\`${player.stats.bedwars.KDRatio}\``, true)
                    .addField('最終擊殺數', `\`${commaNumber(player.stats.bedwars.finalKills)}\``, true)
                    .addField('最終死亡數', `\`${commaNumber(player.stats.bedwars.finalDeaths)}\``, true)
                    .addField('FKDR', `\`${player.stats.bedwars.finalKDRatio}\``, true)
                    .addField('拆床數', `\`${commaNumber(player.stats.bedwars.beds.broken)}\``, true)
                    .addField('床爆數', `\`${commaNumber(player.stats.bedwars.beds.lost)}\``, true)
                    .addField('BBLR', `\`${player.stats.bedwars.beds.BLRatio}\``, true)
                    .addField('總共獲得的鐵', `\`${commaNumber(player.stats.bedwars.collectedItemsTotal.iron)}\``, true)
                    .addField('總共獲得的金', `\`${commaNumber(player.stats.bedwars.collectedItemsTotal.gold)}\``, true)
                    .addField('總共獲得的鑽石', `\`${commaNumber(player.stats.bedwars.collectedItemsTotal.diamond)}\``, true)
                    .addField('總共獲得的綠寶石', `\`${commaNumber(player.stats.bedwars.collectedItemsTotal.emerald)}\``, true)
                    .addField('平均一場的最終擊殺', `\`${commaNumber(player.stats.bedwars.avg.finalKills)}\``, true)
                    .addField('平均一場的床數', `\`${commaNumber(player.stats.bedwars.avg.bedsBroken)}\``, true)
                    .addField(`贏幾場才會到\n${commaNumber(Math.ceil(player.stats.bedwars.WLRatio))} WLR`, `\`${commaNumber((player.stats.bedwars.losses*Math.ceil(player.stats.bedwars.WLRatio))-player.stats.bedwars.wins)}\``, true)
                    .addField(`幾個最終擊殺才會到\n${commaNumber(Math.ceil(player.stats.bedwars.finalKDRatio))} FKDR`, `\`${commaNumber((player.stats.bedwars.finalDeaths*Math.ceil(player.stats.bedwars.finalKDRatio))-player.stats.bedwars.finalKills)}\``, true)
                    .addField(`拆掉幾張床才會到\n${commaNumber(Math.ceil(player.stats.bedwars.beds.BLRatio))} BBLR`, `\`${commaNumber((player.stats.bedwars.beds.lost*Math.ceil(player.stats.bedwars.beds.BLRatio))-player.stats.bedwars.beds.broken)}\``, true)

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
                    const error = new Discord.MessageEmbed(base)
                        .setAuthor('錯誤', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Error.svg/1200px-Error.svg.png')
                        .setDescription('<a:arrowded:974236415397351424> **找不到此名稱**')
                    message.reply({ embeds: [error], allowedMentions: { repliedUser: false } })
                }       
        });
    }
}