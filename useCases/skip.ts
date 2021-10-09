import { VoiceConnection, Message } from "discord.js";
import { getQueue } from "../model/queue";

const skip = (connection: VoiceConnection, message: Message) => {
  if (!message.member?.voice.channel)
    return message.channel.send(
      "Você precisa estar em um canal de voz para passar a música!"
    );
  
  const queue = getQueue();

  if (queue.length === 0)
    return message.channel.send("Não tem música pra passar!");
  connection.dispatcher.end();
}

export default skip;