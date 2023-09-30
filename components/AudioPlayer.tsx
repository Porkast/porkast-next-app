'use client'

import 'shikwasa/dist/style.css'
import { Player } from 'shikwasa'
import { Ref, forwardRef, useEffect } from 'react';

export type AudioPlayerProps = {
    data?: {
        title: string;
        artist: string;
        cover: string;
        src: string;
    };
};

export type AudioPlayerRef = {
    play: () => void;
    pause: () => void;
    updateAudioData: ({ title, artist, cover, src }: { title: string; artist: string; cover: string; src: string; }) => void;
};

const AudioPlayer = forwardRef<AudioPlayerRef, AudioPlayerProps>((props, ref: Ref<AudioPlayerRef>) => {
    const { data } = props;
    const { title, artist, cover, src } = data ?? { title: '', artist: '', cover: '', src: '' };

    useEffect(() => {
        const playerElement = document.querySelector('.shikwasa-player-element') as HTMLElement;
        if (playerElement !== null) {
            const player = new Player({
                container: () => playerElement,
                audio: {
                    title,
                    artist,
                    cover,
                    src,
                },
                themeColor: 'black',
                theme: 'light',
                autoplay: true,
            });

            player.on('canplay', () => {
                player.play()
            });
            player.on('playing', () => {
                // when audio is playing translate the player to the right with 688px
                playerElement.classList.add('md:translate-x-610', 'transition', 'duration-300', 'delay-150');
            });
            if (ref) {
                (ref as any).current = {
                    play: () => {
                        player.play();
                    },
                    pause: () => {
                        player.pause();
                    },
                    updateAudioData: ({ title, artist, cover, src }: { title: string; artist: string; cover: string; src: string; }) => {
                        player.updateAudio({
                            title,
                            artist,
                            cover,
                            src,
                        })
                    },
                }
            }
        }
    }, [src]);

    return (
        <div className='w-full flex justify-end'>
            <div className="shikwasa-player-element fixed bottom-0 w-md md:bottom-36 hover:translate-x-0">
            </div>
        </div>
    );
})

export default AudioPlayer;