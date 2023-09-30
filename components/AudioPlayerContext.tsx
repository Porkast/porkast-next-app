'use client'

import { createContext, useContext, useRef, } from 'react';
import AudioPlayer, { AudioPlayerRef } from './AudioPlayer';

type AudioPlayerContextType = {
    updateAudio: ({ title, artist, cover, src }: { title: string; artist: string; cover: string; src: string; }) => void;
    play: () => void;
    pause: () => void;
};

const AudioPlayerContext = createContext<AudioPlayerContextType>({
    play: () => { },
    pause: () => { },
    updateAudio: function ({ title, artist, cover, src }: { title: string; artist: string; cover: string; src: string; }): void {
        throw new Error('Function not implemented.');
    }
});

export const useAudioPlayer = () => useContext(AudioPlayerContext);

type AudioPlayerProviderProps = {
    children: React.ReactNode;
};

export const AudioPlayerProvider: React.FC<AudioPlayerProviderProps> = ({ children }) => {
    const audioRef = useRef<AudioPlayerRef>(null);
    const audioPlayerContextValue: AudioPlayerContextType = {
        play: () => {
            if (audioRef.current) {
                audioRef.current.play();
            }
        },
        pause: () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        },
        updateAudio: function ({ title, artist, cover, src }: { title: string; artist: string; cover: string; src: string; }): void {
            if (audioRef.current) {
                audioRef.current.updateAudioData({ title, artist, cover, src });
            }
        }
    };

    return (
        <AudioPlayerContext.Provider value={audioPlayerContextValue}>
            {children}
            <AudioPlayer ref={audioRef} data={{ title: 'porkast', artist: 'porkast', cover: 'https://shikwasa.js.org/assets/logo.png', src: 'https://shikwasa.js.org/assets/STS-133_FD11_Mission_Status_Briefing.mp3' }} />
        </AudioPlayerContext.Provider>
    );
};