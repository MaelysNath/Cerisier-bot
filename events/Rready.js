module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
      console.log(`Bot en ligne en tant que ${client.user.tag}!`);
    }
  };