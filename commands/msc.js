module.exports = {
    name: 'msc',
    description: 'Mostra como usar o comando !d',
    allowedChannelId: '1264360916674285599', 
    execute(message) {
      console.log(`Command !musica executed in channel: ${message.channel.id}`);
      if (message.channel.id !== this.allowedChannelId) {
        return message.channel.send('**Este comando não é permitido neste canal.**');
      }
      message.channel.send('**Uso correto do comando !d:** `!d <link> <formato>`\n\n**Baixa um vídeo ou áudio do YouTube e envia o arquivo no chat.**\n\n**Formato disponível:** `audio` ou `video`.');
    },
  };
  
