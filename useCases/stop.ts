import { VoiceConnection, Message } from "discord.js";
import { emptyQueue, getQueue } from "../model/queue";

const stop = (connection: VoiceConnection, message: Message) => {
  if (!message.member?.voice.channel)
    return message.channel.send(
      "Você precisa estar em um canal de voz para parar uma música!"
    );

  const queue = getQueue();
    
  if (queue.length === 0)
    return message.channel.send("Não tem nenhuma música para parar!");
  
  emptyQueue();
  connection.dispatcher.end();
}

export default stop;
