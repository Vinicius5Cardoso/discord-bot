const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'msc',
    description: 'Mostra como usar o comando !d',
    allowedChannelId: '1264360916674285599',
    async execute(message) {
        console.log(`Command !msc executed in channel: ${message.channel.id}`);
        if (message.channel.id !== this.allowedChannelId) {
            return message.channel.send('**Este comando não é permitido neste canal.**');
        }

        const embed = new EmbedBuilder()
            .setColor('#0099ff') 
            .setTitle('Uso do comando !d')
            .setDescription('**Uso correto do comando !d:** `!d <link> <formato>`\n\n**Baixa um vídeo ou áudio do YouTube e envia o arquivo no chat.**\n\n**Formato disponível:** `audio` ou `video`.\n\n**[Twitter](https://x.com/NotYounk) [GitHub](https://github.com/younk5).**')
            .setTimestamp(); 
        const responseMessage = await message.channel.send({ embeds: [embed] });

        await message.delete();
    },
};
