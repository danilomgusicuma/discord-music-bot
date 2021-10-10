import { VoiceConnection } from "discord.js";
import { Song } from "./song";

export interface Queue {
  songs: Song[];
  queueVoiceConnection: VoiceConnection | null;
}

//server: queue
export type Queues = Map<string, Queue>;
