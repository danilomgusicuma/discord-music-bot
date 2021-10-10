import { Message } from "discord.js";
import ytdl from "ytdl-core-discord";
import { getQueue, queuePush, setConnection } from "../queueManager/queue";
import { Song } from "../model/song";
import getYTurl from "../helpers/getYTurl";

const play = async (serverId: string, message: Message, song: Song) => {

  const serverQueue = getQueue(serverId)
  if (!serverQueue) return console.log("server queue is undefined!");

  const queueVoiceConnection = serverQueue.queueVoiceConnection;
  if (!queueVoiceConnection) return console.log("voice connection is undefined!");

  queueVoiceConnection.play(await ytdl(song.url, {filter:"audioonly", highWaterMark: 1<<25, quality: "highestaudio"}), { type: 'opus', highWaterMark: 1 })
  .on("finish", () => {
    serverQueue.songs.shift();
    play(serverId, message, serverQueue.songs[0]);
  })
  .on("error", (err) => console.error(err));

  message.channel.send(`tocando agora ${song.title}`)
};

async function execute(message: Message) {
  const args = message.content.split(" ");
  args.shift();
  const query = args.join(" ");
  if (!query) {
    return message.channel.send(
      "Adicione uma música seguindo o formato '!sing música'"
    );
  }

  const ytURL = await getYTurl(query);

  const voiceChannel = message.member?.voice.channel;
  if (!voiceChannel)
    return message.channel.send(
      "Você precisa estar num canal de voz pra eu cantar!!!"
    );
  const permissions = voiceChannel.permissionsFor(message.client.user!);
  if (!permissions?.has("CONNECT") || !permissions?.has("SPEAK")) {
    return message.channel.send(
      "Eu preciso de permissão pra entrar e falar no seu canal de voz :(("
    );
  }

  const songInfo = await ytdl.getInfo(ytURL);

  const song = {
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url,
  };

  const serverId = message.guild?.id;
  if (!serverId) return console.log("server id is undefined!");

  const {songs} = queuePush(serverId, song);

  if (songs.length > 1) {
    message.channel.send(`enfileirando ${song.title}`)
    return;
  } else {
    try {
      var voiceConnection = await voiceChannel.join();
      setConnection(serverId, voiceConnection);
      play(serverId, message, song);
    } catch (err) {
      console.log(err);
      return message.channel.send(err as string);
    }
  }
}

export default execute;
