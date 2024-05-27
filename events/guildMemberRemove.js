const { EmbedBuilder, ChannelType } = require('discord.js');
const config = require('../config.json');

module.exports = {
  name: 'guildMemberRemove',
  async execute(member) {
    
    const channel = member.guild.channels.cache.get(config.welcomeChannelId);
    if (channel && channel.type === ChannelType.GuildText) {
      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('Départ')
        .setDescription(` ${member.user.tag} à quitté le serveur`)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true, format: 'png', size: 4096 }))
        .setTimestamp();

      try {
        await channel.send({ embeds: [embed] });
      } catch (error) {
        console.error(`Erreur lors de l'envoi du message de départ pour ${member.user.tag}:`, error);
      }
    } else {
      console.error(`Salon avec ID ${config.welcomeChannelId} introuvable ou n'est pas un salon textuel.`);
    }
  }
};
