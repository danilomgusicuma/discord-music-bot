import { VoiceConnection } from "discord.js";
import { Queue, Queues } from "src/model/queue";
import { Song } from "src/model/song";

let queues: Queues = new Map();

export const getQueue = (serverId: string) => {
  return queues.get(serverId);
}

export const queuePush = (serverId:string, song: Song) => {
  let serverQueue = getQueue(serverId);
  if (!serverQueue){
    const newQueue: Queue = {
      songs: [],
      queueVoiceConnection: null,
    }
    queues.set(serverId, newQueue);
    serverQueue = newQueue;
  }
  serverQueue.songs.push(song);
  return serverQueue;
}

export const setConnection = (serverId:string, voiceConnection: VoiceConnection) => {
  const serverQueue = getQueue(serverId);
  if (serverQueue) serverQueue.queueVoiceConnection = voiceConnection;
  //TODO: error message if there is no server queue
}
