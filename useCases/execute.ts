import { Message, VoiceConnection } from "discord.js";
import ytdl from "ytdl-core-discord";
import api from "../helpers/youtubeApi";
import { getQueue, queuePush, setConnection } from "../model/queue";
import { Song } from "model/song";

const getYTurl = async (query: string) => {
  const { data } = await api.get<any>("/search", { params:{
    part: "snippet",
    q: query,
    type: "video",
  }});
  return `https://www.youtube.com/watch?v=${data.items[0].id.videoId}`;
}

async function execute(message: Message) {
  const args = message.content.split(" ");
  args.shift();
  const query = args.join(" ");
  if (!query) {
    return message.channel.send(
      "Adicione uma música seguindo o formato '!play música'"
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

  const queue = getQueue()

  queuePush(song);

  if (queue.length > 1) {
    message.channel.send(`enfileirando ${song.title}`)
    return;
  } else {
    try {
      var connection = await voiceChannel.join();
      setConnection(connection);
      play(connection, message, song);
    } catch (err) {
      console.log(err);
      return message.channel.send(err as string);
    }
  }
}

const play = async (connection: VoiceConnection, message: Message, song: Song) => {
  connection.play(await ytdl(song.url, {filter:"audioonly", highWaterMark: 1<<25, quality: "highestaudio"}), { type: 'opus', highWaterMark: 1 })
  .on("finish", () => {
    const queue = getQueue();
    queue.shift();
    play(connection, message, queue[0]);
  })
  .on("error", (err) => console.error(err));
  message.channel.send(`tocando agora ${song.title}`)
};

export default execute;
