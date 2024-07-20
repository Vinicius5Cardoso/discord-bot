module.exports = {
    name: 'clear',
    description: 'Limpa uma quantidade específica de mensagens no chat.',
    async execute(message, args) {
      // Verifique se o comando é executado em um canal permitido, se necessário
      // if (message.channel.id !== 'ID_DO_CANAL_PERMITIDO') {
      //   return message.channel.send('Este comando não é permitido neste canal.');
      // }
  
      // Verifique se o usuário tem a permissão necessária
      if (!message.member.permissions.has('MANAGE_MESSAGES')) {
        return message.channel.send('Você não tem permissão para usar este comando.');
      }
  
      // Verifique se a quantidade de mensagens a serem removidas foi especificada
      if (args.length === 0) {
        return message.channel.send('Por favor, forneça o número de mensagens a serem limpas.');
      }
  
      // Tente converter o argumento para um número
      const amount = parseInt(args[0]);
  
      // Verifique se o argumento é um número válido e está dentro do intervalo permitido
      if (isNaN(amount) || amount <= 0 || amount > 100) {
        return message.channel.send('Por favor, forneça um número de mensagens válido entre 1 e 100.');
      }
  
      try {
        // Use o método bulkDelete para limpar as mensagens
        await message.channel.messages.fetch({ limit: amount }).then(messages => {
          message.channel.bulkDelete(messages);
        });
  
        // Envie uma mensagem de confirmação
        message.channel.send(`**${amount}** mensagem(s) limpa(s) com sucesso.`).then(msg => {
          // Apague a mensagem de confirmação após 5 segundos
          setTimeout(() => msg.delete(), 5000);
        });
      } catch (error) {
        console.error('Erro ao tentar limpar as mensagens:', error);
        message.channel.send('Houve um erro ao tentar limpar as mensagens.');
      }
    },
  };
  