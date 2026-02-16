import { useEffect, useRef } from "react";

type AudioProps = {
    src: string;
    loop?: boolean;
    fadeIn?: number; // fade in 시간 (ms)
}

const PlaySong = ({src, loop = false, fadeIn = 0}: AudioProps) => {
    // audio Element
    const audioRef = useRef<HTMLAudioElement>(null);
    // source Element
    const sourceRef = useRef<HTMLSourceElement>(null);

    // 볼륨을 서서히 올리는 fade in 효과
    const startFadeIn = (audio: HTMLAudioElement) => {
        if (fadeIn <= 0) return;
        audio.volume = 0;
        const step = 50; // 50ms 간격으로 볼륨 증가
        const increment = step / fadeIn;
        const interval = setInterval(() => {
            const next = audio.volume + increment;
            if (next >= 1) {
                audio.volume = 1;
                clearInterval(interval);
            } else {
                audio.volume = next;
            }
        }, step);
    }

    // play Audio
    const playAudio = () => {
        const audio = audioRef.current;
        if(!audio) return;
        if (fadeIn > 0) audio.volume = 0;
        // audio play
        // 0. 오디오 재생
        audio.play().then(() => {
            startFadeIn(audio);
        }).catch(error => {
            console.log(error);
            const handler = () => {
                // 2. 그래도 오류 발생하면 error 로그 출력하고 끝
                audio.play().then(() => {
                    startFadeIn(audio);
                }).catch(error => console.log(error));
                document.removeEventListener('click', handler);
            }
            // 1. 0번에서 audio.play() 실행 시 error가 났을 때 다시 한 번 audio.play() 시도
            document.addEventListener('click', handler);
        });
    }

    // 컴포넌트 최초 마운트 or src 변경 시
    useEffect(() => {
        const audio = audioRef.current;
        const source = sourceRef.current;
        if(!audio || !source) return;
        // src 변경 시 기존 오디오 종료
        if(!audio.paused || audio.duration > 0) {
            audio.pause();
            audio.currentTime = 0;
        }
        // 새로운 src로 오디오 재생
        source.src = src || '';
        audio.load();
        playAudio();
    }, [src]);


    return (
        <audio ref={audioRef} loop={loop} autoPlay={true} preload={'auto'}>
            <source ref={sourceRef} src={src} type={'audio/mpeg'}/>
            Your browser does not support the audio element.
        </audio>
    )
}

export default PlaySong;