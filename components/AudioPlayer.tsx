'use client'

import 'shikwasa/dist/style.css'
import { Player } from 'shikwasa'
import { useEffect } from 'react';

type AudioPlayerProps = {
    data: {
        title: string;
        artist: string;
        cover: string;
        src: string;
    };
};

export default function AudioPlayer(props: AudioPlayerProps) {
    const { title, artist, cover, src } = props.data;

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
                playerElement.classList.add('md:translate-x-3/4', 'transition', 'duration-300','delay-150');

            });
        }
    }, [src]);

    return (
        <div className='w-full flex justify-end'>
            <div className="shikwasa-player-element fixed bottom-0 w-md md:bottom-36 hover:translate-x-0">
            </div>
        </div>
    );
}