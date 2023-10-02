'use client'

import { createContext, useContext, useRef, } from 'react';
import AudioPlayer, { AudioPlayerRef } from './AudioPlayer';
import { MsgAlert, MsgAlertRef, MsgAlertType } from './MsgAlert';

type AppContextType = {
    updateAudio: (params: AudioPlayerParams) => void;
    play: () => void;
    pause: () => void;
    showMsgAlert: (msg: string, msgType: MsgAlertType) => void;
};

const AppContext = createContext<AppContextType>({
    play: () => { },
    pause: () => { },
    updateAudio: function (params: AudioPlayerParams): void {
        throw new Error('Function not implemented.');
    },
    showMsgAlert: function (msg: string, msgType: MsgAlertType): void {
    }
});

export const useAppContext = () => useContext(AppContext);

type AppProviderProps = {
    children: React.ReactNode;
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const audioRef = useRef<AudioPlayerRef>(null);
    const msgAlertRef = useRef<MsgAlertRef>(null)
    const appContextValue: AppContextType = {
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
        updateAudio: function (params: AudioPlayerParams): void {
            if (audioRef.current) {
                audioRef.current.updateAudioData({ params });
            }
        },
        showMsgAlert: function (msg: string, msgType: MsgAlertType): void {
            msgAlertRef.current?.showAlert(msg, msgType)
        }
    };

    return (
        <AppContext.Provider value={appContextValue}>
            {children}
            <AudioPlayer ref={audioRef} data={{ title: 'porkast', artist: 'porkast', cover: 'https://shikwasa.js.org/assets/logo.png', src: 'https://shikwasa.js.org/assets/STS-133_FD11_Mission_Status_Briefing.mp3' }} />
            <MsgAlert ref={msgAlertRef} />
        </AppContext.Provider>
    );
};