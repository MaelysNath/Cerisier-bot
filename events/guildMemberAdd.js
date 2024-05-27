const { EmbedBuilder, ChannelType } = require('discord.js');
const config = require('../config.json');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    const role = member.guild.roles.cache.get(config.roleIdToAdd);
    if (role) {
      try {
        await member.roles.add(role);
        console.log(`Rôle ${role.name} attribué à ${member.user.tag}.`);
      } catch (error) {
        console.error(`Erreur lors de l'attribution du rôle à ${member.user.tag}:`, error);
      }
    } else {
      console.error(`Rôle avec ID ${config.roleIdToAdd} introuvable.`);
    }

    const channel = member.guild.channels.cache.get(config.welcomeChannelId);
    if (channel && channel.type === ChannelType.GuildText) {
      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Arrivé')
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true, format: 'png', size: 4096 }))
        .addFields(
          { name: 'Pseudo', value: member.user.tag, inline: true },
          { name: 'ID', value: member.user.id, inline: true },
          { name: 'Création du compte', value: member.user.createdAt.toLocaleDateString('fr-FR'), inline: true }
        )
        .setTimestamp();

      try {
        await channel.send({ embeds: [embed] });
      } catch (error) {
        console.error(`Erreur lors de l'envoi du message de bienvenue pour ${member.user.tag}:`, error);
      }
    } else {
      console.error(`Salon avec ID ${config.welcomeChannelId} introuvable ou n'est pas un salon textuel.`);
    }
  }
};