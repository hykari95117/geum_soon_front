import { useCallback } from 'react';

const useSoundEffect = (src: string) => {
    return useCallback(() => {
        const sound = new Audio(src);
        sound.currentTime = 0;
        sound.play();
    }, [src]);
}

export default useSoundEffect;
