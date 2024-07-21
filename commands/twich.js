const axios = require('axios');
require('dotenv').config();
const ALLOWED_CHANNEL_ID = '1264361701977886730'; 

module.exports = {
  name: 'twitch',
  description: 'Verifica se o canal da Twitch está ao vivo.',
  async execute(message, args) {
    if (message.channel.id !== ALLOWED_CHANNEL_ID) {
      return message.reply('Este comando não é permitido neste canal.');
    }

    const clientId = process.env.TWITCH_CLIENT_ID;
    const clientSecret = process.env.TWITCH_CLIENT_SECRET;

    if (!args.length) {
      return message.reply('Você precisa fornecer um nome de usuário ou link da Twitch!');
    }

    let username = args[0];

    const urlPattern = /(?:https?:\/\/)?(?:www\.)?twitch\.tv\/([a-zA-Z0-9_]+)/;
    const match = username.match(urlPattern);
    if (match) {
      username = match[1];
    }

    try {
      const authResponse = await axios.post('https://id.twitch.tv/oauth2/token', null, {
        params: {
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'client_credentials'
        }
      });
      const accessToken = authResponse.data.access_token;

      const headers = {
        'Client-ID': clientId,
        'Authorization': `Bearer ${accessToken}`
      };

      const response = await axios.get('https://api.twitch.tv/helix/streams', {
        headers: headers,
        params: {
          user_login: username
        }
      });

      const streamData = response.data.data;

      let statusMessage;
      if (streamData.length > 0 && streamData[0].type === 'live') {
        statusMessage = `${message.author} https://www.twitch.tv/${username} está ao vivo!`;
      } else {
        statusMessage = `${message.author} https://www.twitch.tv/${username} não está ao vivo no momento.`;
      }

      // Envia a mensagem de resposta
      await message.channel.send(statusMessage);

      // Apaga a mensagem com o comando digitado
      await message.delete();
      
    } catch (error) {
      console.error(error);
      message.channel.send('Houve um erro ao verificar o status do canal.');
    }
  },
};
