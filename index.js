//Dev par @MaelysNath
//merci à Lotharie, Zarmakuizz pour votre aide <3



//déclarations des intents
const { Client, EmbedBuilder, ChannelType, Collection, GatewayIntentBits, Partials, ButtonBuilder, ButtonStyle, ActionRowBuilder  } = require( "discord.js" );
require("dotenv").config();
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildModeration,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessageTyping,
	],
	partials: [
		Partials.Message,
		Partials.Reaction,
		Partials.GuildMember,
		Partials.User,
		Partials.Channel,
		Partials.ThreadMember,
		
	]
});

//lorsque le bot est en ligne
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });


  //création automatique des therads/likes à chaque messages envoyés dans le salon spécifique
	
    client.on('messageCreate', async msg => {
	
      //Salons 
      let salons = ["1238955606832971846", "1238954184863256667", "1238955205324832841"] // ID des salon pour que le bot exécute les therads/likes
      for(let i = 0; i < salons.length; i++) {
        if(msg.channel.id === salons[i]){
          const thread = await msg.startThread({
            name: "Commentaires",
            autoArchiveDuration: 1440,
          });
          console.log(`Created thread: ${thread.name}`);
          msg.react('❤️'); // choisis ton émoji 
        }
      }	
    
      
    //une autre mais dans une autre salon spécifique sans les threads
        let salons3 = ("1214972953201082428"); // ID du salon spécifique
        if(msg.channel.id === salons3){
          msg.react('✅');
        }
      
    });

  
  

//Lorsque qu'un membre rejoint le serveur, il obtient un rôle automatiquement

  client.on('guildMemberAdd', member => {
    const roleId = '1239704991447650335'; //ID du rôle que tu souhaite lui attribuer à son arrivé
    const role = member.guild.roles.cache.get(roleId);
    if (role) {
        member.roles.add(role)
            .then(() => console.log(`Rôle ajouté à ${member.user.tag}`))
            .catch(console.error);
    } else {
        console.error(`Impossible de trouver le rôle avec l'ID ${roleId}`);
    }
});

client.on('messageCreate', async (message) => {
  if (message.content === '!bienvenue') {
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Bienvenue sur le serveur')
      .setDescription('Je vous invite à lire le règlement du serveur puis d\'envoyer votre demande d\'adhésion ci-dessous');

    const link = new ButtonBuilder()
      .setLabel('⚡Lire le règlement')
      .setURL('https://discord.com/channels/1071578772916162680/1214972871907082271/1240303359076859905')
      .setStyle(ButtonStyle.Link);

    const button = new ButtonBuilder()
      .setStyle(ButtonStyle.Primary)
      .setLabel('✅ Demande d\'adhésion')
      .setCustomId('validateButton');

    const row = new ActionRowBuilder()
      .addComponents(link, button);

    await message.channel.send({
      embeds: [embed],
      components: [row]
    });
  }
});

 
// Formulaire d'adhésion en embed
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === 'validateButton') {
    const rroleId = '1239704991447650335'; // ID du rôle que tu souhaites retirer
    const roleId = '1244734836942442556'; // ID du rôle que tu souhaites ajouter
    const user = interaction.user; 
    const member = interaction.guild.members.cache.get(user.id);
    const creationDate = user.createdAt.toLocaleDateString('fr-FR');
    
    try {
      await member.roles.remove(rroleId); // Retire le rôle
      await member.roles.add(roleId); // Ajoute le rôle
      
      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Demande d\'adhésion')
        .setDescription(`Un utilisateur souhaite entrer dans le serveur.`)
        .setThumbnail(user.displayAvatarURL({ dynamic: true, format: 'png', size: 4096 }))
        .addFields(
          { name: 'Pseudo', value: user.tag }, // pseudo
          { name: 'Identifiant', value: user.id }, // Identifiant (qui permet de detecter pour sa validation)
          { name: 'Création du compte', value: creationDate } // date de création du compte Discord
        );

      const acceptButton = new ButtonBuilder()
        .setStyle(ButtonStyle.Success)
        .setLabel('Accepter')
        .setCustomId('acceptButton');

      const rejectButton = new ButtonBuilder()
        .setStyle(ButtonStyle.Danger)
        .setLabel('Refuser')
        .setCustomId('rejectButton');

      const row = new ActionRowBuilder()
        .addComponents(acceptButton, rejectButton);

      const channel = client.channels.cache.get('1239726204551036998'); // ID du salon - envoie la fiche de demande d'adhésion dans le salon spécifique
      
      if (channel.type === ChannelType.GuildText) {
        await channel.send({ 
          embeds: [embed],
          components: [row] 
        });

        await interaction.reply({ content: 'Je prends en compte ta demande d\'adhésion, attends que la modération valide ta demande.', ephemeral: true }); // Envoie une réponse lorsque le membre a cliqué sur "demande" d'adhésion
      } else {
        console.log('Salon introuvable.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'attribution ou de la suppression du rôle :', error);
      await interaction.reply({ content: 'Une erreur est survenue lors de l\'attribution ou de la suppression du rôle.', ephemeral: true });
    }
  } else if (interaction.customId === 'acceptButton') {
    const userId = interaction.message.embeds[0].fields.find(field => field.name === 'Identifiant').value;
    const member = interaction.guild.members.cache.get(userId);
    const role = interaction.guild.roles.cache.get('1239704764657307741'); // Rôle à attribuer (Membre)
    const membre = interaction.guild.roles.cache.get('1238998976712278087'); // Deuxième rôle à attribuer (facultatif)
    const nverifie = interaction.guild.roles.cache.get('1244734836942442556'); // Rôle que tu souhaites enlever au moment de la validation
    
    if (member && role) {
      try {
        await member.roles.add([role, membre]);
        await member.roles.remove(nverifie);
        
        const welcomeChannel = interaction.client.channels.cache.get('1238957155361751191'); // ID du salon - pour que le bot envoie dans le salon spécifique
        if (welcomeChannel.type === ChannelType.GuildText) {
          await welcomeChannel.send(`🌸 Coucou ! Bienvenue sur le serveur ${member.user.toString()} !`); // Message de bienvenue en mentionnant l'utilisateur
        } else {
          console.log('Salon de bienvenue introuvable.');
        }

        const disabledAcceptButton = new ButtonBuilder()
          .setStyle(ButtonStyle.Secondary)
          .setLabel('✅ Accepter')
          .setCustomId('acceptButton')
          .setDisabled(true);

        const disabledRejectButton = new ButtonBuilder()
          .setStyle(ButtonStyle.Secondary)
          .setLabel('🚫 Refuser')
          .setCustomId('rejectButton')
          .setDisabled(true);

        const row = new ActionRowBuilder()
          .addComponents(disabledAcceptButton, disabledRejectButton);

        await interaction.message.edit({ components: [row] });
        await interaction.reply({ content: 'L\'utilisateur a été accepté et le rôle lui a été attribué.', ephemeral: true });
      } catch (error) {
        console.error('Erreur lors de l\'attribution du rôle :', error);
        await interaction.reply({ content: 'Une erreur est survenue lors de l\'attribution du rôle.', ephemeral: true });
      }
    } else {
      console.error('Membre ou rôle introuvable.');
      await interaction.reply({ content: 'Le membre ou le rôle spécifié est introuvable.', ephemeral: true });
    }
  } else if (interaction.customId === 'rejectButton') {
    const userId = interaction.message.embeds[0].fields.find(field => field.name === 'Identifiant').value;
    const member = interaction.guild.members.cache.get(userId);
    if (member) {
      try {
        await member.kick('Invitation refusée');
        
        const disabledAcceptButton = new ButtonBuilder()
          .setStyle(ButtonStyle.Success)
          .setLabel('Accepter')
          .setCustomId('acceptButton')
          .setDisabled(true);

        const disabledRejectButton = new ButtonBuilder()
          .setStyle(ButtonStyle.Danger)
          .setLabel('Refuser')
          .setCustomId('rejectButton')
          .setDisabled(true);

        const row = new ActionRowBuilder()
          .addComponents(disabledAcceptButton, disabledRejectButton);

        await interaction.message.edit({ components: [row] });
        await interaction.reply({ content: 'L\'utilisateur a été refusé et a été expulsé du serveur.', ephemeral: true });
      } catch (error) {
        console.error('Erreur lors de l\'expulsion :', error);
        await interaction.reply({ content: 'Une erreur est survenue lors de l\'expulsion.', ephemeral: true });
      }
    } else {
      console.error('Membre introuvable.');
      await interaction.reply({ content: 'Le membre spécifié est introuvable.', ephemeral: true });
    }
  }
});
  


//connexion du bot
client.login(process.env.TOKEN);
