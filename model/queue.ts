import { VoiceConnection } from "discord.js";
import { Song } from "model/song";

let queue: Song[] = [];
let queueConnection: VoiceConnection | null = null;

export const queuePush = (song: Song) => {
  queue.push(song);
}

export const getQueue = () => {
  return queue;
}

export const emptyQueue = () => {
  queue = [];
}

export const setConnection = (connection: VoiceConnection) => {
  queueConnection = connection
}

export const getConnection = () => {
  return queueConnection
}
