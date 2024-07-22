export interface AudioContextType {
  playAudio: (purpose: AudioPurpose) => void;
}

export type AudioPurpose =
  | "player-room-join"
  | "player-room-leave"
  | "room-deleted";

export type AudiosType = Record<AudioPurpose, Howl>;

export interface AudioFileType {
  purpose: AudioPurpose;
  src: string;
  volume?: number;
  loop?: boolean;
}
