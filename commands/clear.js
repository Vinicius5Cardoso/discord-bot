module.exports = {
    name: 'clear',
    description: 'Limpa uma quantidade específica de mensagens no chat.',
    async execute(message, args) {

  
      if (!message.member.permissions.has('MANAGE_MESSAGES')) {
        return message.channel.send('Você não tem permissão para usar este comando.');
      }
  
      if (args.length === 0) {
        return message.channel.send('Por favor, forneça o número de mensagens a serem limpas.');
      }
  
      const amount = parseInt(args[0]);
  
      if (isNaN(amount) || amount <= 0 || amount > 100) {
        return message.channel.send('Por favor, forneça um número de mensagens válido entre 1 e 100.');
      }
  
      try {
        await message.channel.messages.fetch({ limit: amount }).then(messages => {
          message.channel.bulkDelete(messages);
        });
  
        message.channel.send(`**${amount}** mensagem(s) limpa(s) com sucesso.`).then(msg => {
          setTimeout(() => msg.delete(), 5000);
        });
      } catch (error) {
        console.error('Erro ao tentar limpar as mensagens:', error);
        message.channel.send('Houve um erro ao tentar limpar as mensagens.');
      }
    },
  };
  
