const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const YTDLP_PATH = 'C:\\yt-dlp\\yt-dlp.exe'; 
const ALLOWED_CHANNEL_ID = '1264545742626885653'; 

module.exports = {
  name: 'd',
  description: 'Baixa um vídeo ou áudio do YouTube e envia o arquivo na DM do usuário.',
  async execute(message, args) {
    if (message.channel.id !== ALLOWED_CHANNEL_ID) {
      return message.reply('Este comando não é permitido neste canal.');
    }

    const formatEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Selecione o formato de download')
      .setDescription('Por favor, selecione o formato que deseja baixar:')
      .setFooter({ text: 'Escolha entre "audio" ou "video".' });

    const audioButton = new ButtonBuilder()
      .setCustomId('audio')
      .setLabel('Áudio')
      .setStyle(ButtonStyle.Primary);

    const videoButton = new ButtonBuilder()
      .setCustomId('video')
      .setLabel('Vídeo')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder()
      .addComponents(audioButton, videoButton);

    await message.channel.send({ embeds: [formatEmbed], components: [row] });

    const filter = i => i.customId === 'audio' || i.customId === 'video';
    const collector = message.channel.createMessageComponentCollector({ filter, time: 60000 });

    collector.on('collect', async i => {
      const requestMessage = await message.reply({
        content: 'Por favor, envie o link do vídeo do YouTube.',
        ephemeral: true
      });

      const user = i.user;
      const linkFilter = m => m.author.id === user.id;
      const linkCollector = message.channel.createMessageCollector({ filter: linkFilter, time: 60000 });

      linkCollector.on('collect', async m => {
        const url = m.content;
        const formato = i.customId;
        const output = formato === 'audio' ? 'audio.mp3' : 'video.mp4';

        await m.delete();

        const cmd = `"${YTDLP_PATH}" "${url}" -f ${formato === 'audio' ? 'bestaudio' : 'bestvideo'} -o ${output} --progress`;
        console.log(`Executing command: ${cmd}`);

        const progressMessage = await message.channel.send('Iniciando o download...');

        const downloadProcess = exec(cmd);

        let lastProgress = 0;

        downloadProcess.stdout.on('data', async (data) => {
          const lines = data.toString().split('\n');
          for (const line of lines) {
            if (line.includes('[download]')) {
              const match = line.match(/\[download\]\s+(\d+(\.\d+)?)%/);
              if (match) {
                const progress = parseFloat(match[1]);
                if (progress >= lastProgress + 20) {
                  lastProgress = progress;
                  await progressMessage.edit(`Progresso: ${Math.round(progress)}%`);
                }
              }
            }
          }
        });

        downloadProcess.stderr.on('data', data => {
          console.error(`stderr: ${data}`);
        });

        downloadProcess.on('close', async (code) => {
          if (code !== 0) {
            console.error(`yt-dlp process exited with code ${code}`);
            return progressMessage.edit('Ocorreu um erro ao tentar baixar o vídeo/áudio.');
          }

          const filePath = path.resolve(output);
          if (fs.existsSync(filePath)) {
            try {
              await user.send({ content: `Aqui está o arquivo que você pediu:`, files: [filePath] });

              await progressMessage.delete();
              
              fs.unlinkSync(filePath);
            } catch (err) {
              console.error(`Failed to send file: ${err.message}`);
              progressMessage.edit('Ocorreu um erro ao tentar enviar o arquivo.');
            }
          } else {
            console.error(`File not found: ${filePath}`);
            progressMessage.edit('Arquivo não encontrado.');
          }

          await requestMessage.delete();
        });

        linkCollector.stop();
      });

      linkCollector.on('end', collected => {
        if (collected.size === 0) {
          message.channel.send('Tempo expirado para fornecer o link.');
        }
      });
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        message.channel.send('Tempo expirado para seleção de formato.');
      }
    });
  },
};
