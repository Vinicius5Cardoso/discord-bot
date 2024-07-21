const { Message } = require('discord.js');

const ALLOWED_CHANNEL_ID = '1264547235182411816'; // ID do canal permitido

module.exports = {
  name: 'c',
  description: 'Apaga todas as mensagens enviadas pelo bot nas DMs do usuário.',
  async execute(message, args) {
    try {
      // Verifica se o comando foi executado no canal permitido
      if (message.channel.id !== ALLOWED_CHANNEL_ID) {
        return message.reply('Este comando só pode ser usado no canal específico.');
      }

      // Obtém o usuário que enviou o comando
      const user = message.author;

      // Cria ou obtém o canal de DM do usuário
      const dmChannel = await user.createDM();

      // Busca as mensagens do bot nas DMs do usuário
      let messages = await dmChannel.messages.fetch({ limit: 100 });
      let botMessages = messages.filter(msg => msg.author.id === message.client.user.id);

      if (botMessages.size === 0) {
        return message.reply('Não há mensagens do bot para apagar nas suas DMs.');
      }

      // Deleta todas as mensagens do bot nas DMs
      await Promise.all(botMessages.map(msg => msg.delete()));

      message.reply('Todas as mensagens do bot foram apagadas nas suas DMs.');
    } catch (error) {
      console.error('Erro ao apagar mensagens:', error);
      message.reply('Ocorreu um erro ao tentar apagar as mensagens nas suas DMs.');
    }
  },
};
