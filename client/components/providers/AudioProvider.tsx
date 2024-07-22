"use client";

import {
  AudioContextType,
  AudioFileType,
  AudioPurpose,
  AudiosType,
} from "@/@types/audio";
import { Howl } from "howler";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const AudioContext = createContext<AudioContextType>({ playAudio: () => {} });

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({
  children,
}: {
  children: Readonly<ReactNode>;
}) => {
  const [audios, setAudios] = useState<Record<AudioPurpose, Howl>>(
    {} as AudiosType
  );

  useEffect(() => {
    const audioFiles: AudioFileType[] = [
      { purpose: "player-room-join", src: "/audio/player-room-join.wav" },
      { purpose: "player-room-leave", src: "/audio/player-room-leave.mp3" },
      { purpose: "room-deleted", src: "/audio/room-deleted.wav" },
    ] as const;

    const _audios = audioFiles.reduce<AudiosType>((acc, audioFile) => {
      const howl = new Howl({
        src: audioFile.src,
        volume: audioFile.volume,
        loop: audioFile.loop,
        preload: true,
        html5: true,
      });

      acc[audioFile.purpose] = howl;
      return acc;
    }, {} as AudiosType);

    setAudios(_audios);

    return () => {
      Object.values(_audios).forEach((_audio) => _audio.unload());
    };
  }, []);

  function playAudio(purpose: AudioPurpose) {
    const audio = audios[purpose];
    audio.play();
  }

  return (
    <AudioContext.Provider value={{ playAudio }}>
      {children}
    </AudioContext.Provider>
  );
};
