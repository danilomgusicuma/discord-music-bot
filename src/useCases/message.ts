import { Message } from "discord.js";
import {prefix} from "../../config.json";
import execute from "./execute";
import { getQueue } from "../queueManager/queue";
import skip from "./skip";
import stop from "./stop";

export const onMessage = (message: Message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const serverId = message.guild?.id;

  if (!serverId) return console.log("server id is undefined");
  const queue = getQueue(serverId);

  if (message.content.startsWith(`${prefix}sing`)) {
      execute(message);
      return;
  } else if (message.content.startsWith(`${prefix}skip`)) {
      if(!queue) return;
      skip( queue, message);
      return;
  } else if (message.content.startsWith(`${prefix}stop`)) {
      if(!queue) return;
      stop(queue, message);
      return;
  } else {
      message.channel.send("hmm, não entendi");
  }
}