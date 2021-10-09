import { Message } from "discord.js";
import {prefix} from "../config.json";
import execute from "./execute";
import { getConnection } from "../model/queue";
import skip from "./skip";
import stop from "./stop";

export const onMessage = (message: Message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const connection = getConnection();

  if (message.content.startsWith(`${prefix}sing`)) {
      execute(message);
      return;
  } else if (message.content.startsWith(`${prefix}skip`)) {
      if(!connection) return;
      skip( connection, message);
      return;
  } else if (message.content.startsWith(`${prefix}stop`)) {
      if(!connection) return;
      stop(connection, message);
      return;
  } else {
      message.channel.send("hmm, não entendi");
  }
}