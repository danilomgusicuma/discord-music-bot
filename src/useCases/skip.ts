import { Message } from "discord.js";
import { Queue } from "src/model/queue";

const skip = (serverQueue: Queue, message: Message) => {
  if (!message.member?.voice.channel)
    return message.channel.send(
      "Você precisa estar em um canal de voz para passar a música!"
    );

  if (serverQueue.songs.length === 0)
    return message.channel.send("Não tem música pra passar!");
  const { queueVoiceConnection } = serverQueue;
  if (!queueVoiceConnection) return console.log("queue voice connection is undefined!");
  queueVoiceConnection.dispatcher.end();
}

export default skip;