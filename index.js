require('dotenv').config();

const fs = require('fs');
const { Client, Collection, GatewayIntentBits, ActivityType } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.once('ready', () => {
  console.log(`Bot Ready`);


  client.user.setPresence({
    activities: [{
      name: 'Star', 
      type: ActivityType.Streaming, 
      url: 'https://www.twitch.tv/caiozeralol' 
    }],
    status: 'online' 
  })});

client.on('messageCreate', async message => {
  if (!message.content.startsWith('!') || message.author.bot) return;

  const args = message.content.slice(1).split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName);

  if (command.allowedChannelId && message.channel.id !== command.allowedChannelId) {
    console.log(`Execução do comando ${commandName} não permitida neste canal.`);
    return message.reply('Este comando não é permitido neste canal.');
  }

  try {
    await command.execute(message, args);
  } catch (error) {
    console.error(`Erro ao executar o comando ${commandName}:`, error);
    message.reply('Houve um erro ao tentar executar esse comando!');
  }
});

client.login(process.env.DISCORD_TOKEN);
