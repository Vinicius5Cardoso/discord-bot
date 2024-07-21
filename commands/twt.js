const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'twt',
    description: 'Mostra como usar o comando !twitch',
    allowedChannelId: '1264361701977886730',
    async execute(message) {
        console.log(`Command !twt executed in channel: ${message.channel.id}`);
        if (message.channel.id !== this.allowedChannelId) {
            return message.channel.send('**Este comando não é permitido neste canal.**');
        }

        const embed = new EmbedBuilder()
            .setColor('#0099ff') 
            .setTitle('Uso do comando !twitch')
            .setDescription('**Uso correto do comando !twitch:** `!twitch <nome de usuário ou link>`\n\n**Verifica se o canal da Twitch está ao vivo.\n\n** **O nome de usuário pode ser um nome de usuário Twitch ou um link para o canal.**\n\n**[Twitter](https://x.com/NotYounk) [GitHub](https://github.com/younk5).**')
            .setTimestamp(); 

        await message.channel.send({ embeds: [embed] });

        await message.delete();
    },
};
