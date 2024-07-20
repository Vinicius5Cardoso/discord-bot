module.exports = {
    name: 'twt',
    description: 'Mostra como usar o comando !twitch',
    allowedChannelId: '1264361701977886730', // ID do canal permitido para !twt
    execute(message) {
      console.log(`Command !twt executed in channel: ${message.channel.id}`);
      if (message.channel.id !== this.allowedChannelId) {
        return message.channel.send('**Este comando não é permitido neste canal.**');
      }
      message.channel.send('**Uso correto do comando !twitch:** `!twitch <nome de usuário ou link>`\n\n**Verifica se o canal da Twitch está ao vivo.\n\n** **O nome de usuário pode ser um nome de usuário Twitch ou um link para o canal.**');
    },
  };
  