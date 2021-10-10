import "dotenv/config";
import Discord from "discord.js";

import { isReady } from "./src/useCases/ready";
import { onMessage } from "./src/useCases/message";
import { DISC_TOKEN } from "./src/constants/envs";

const client = new Discord.Client();
client.login(DISC_TOKEN);

client.once('ready', () => {
  isReady();
});
client.once('reconnecting', () => {
  console.log('reconectando!');
});
client.once('disconnect', () => {
  console.log('desconectando!');
});

client.on('message', async message => {
  onMessage(message);  
});

client.login(DISC_TOKEN);
