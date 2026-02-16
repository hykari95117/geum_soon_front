const useSoundEffect = (src: string) => {
    return () => {
        const sound = new Audio(src);
        sound.currentTime = 0;
        sound.play();
    }
}

export default useSoundEffect;
