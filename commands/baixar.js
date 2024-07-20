const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const YTDLP_PATH = 'C:\\yt-dlp\\yt-dlp.exe'; 
const ALLOWED_CHANNEL_ID = '1264360916674285599'; 

module.exports = {
  name: 'd',
  description: 'Baixa um vídeo ou áudio do YouTube e envia o arquivo no chat.',
  async execute(message, args) {
    if (message.channel.id !== ALLOWED_CHANNEL_ID) {
      return message.reply('Este comando não é permitido neste canal.');
    }

    if (args.length < 2) {
      return message.reply('Uso correto: !d <link> <formato>');
    }

    const url = args[0];
    const formato = args[1].toLowerCase();
    const output = formato === 'audio' ? 'audio.mp3' : 'video.mp4';

    if (!['audio', 'video'].includes(formato)) {
      return message.reply('Formato inválido. Escolha entre "audio" ou "video".');
    }

    const cmd = `"${YTDLP_PATH}" "${url}" -f ${formato === 'audio' ? 'bestaudio' : 'bestvideo'} -o ${output} --progress`;
    console.log(`Executing command: ${cmd}`);

    const progressMessage = await message.reply('Iniciando o download...');

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
          await progressMessage.edit('Download concluído! Enviando o arquivo...');
          await message.reply({ files: [filePath] });

          fs.unlinkSync(filePath);
        } catch (err) {
          console.error(`Failed to send file: ${err.message}`);
          progressMessage.edit('Ocorreu um erro ao tentar enviar o arquivo.');
        }
      } else {
        console.error(`File not found: ${filePath}`);
        progressMessage.edit('Arquivo não encontrado.');
      }
    });
  },
};
