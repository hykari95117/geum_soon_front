import '../styles/Opening.css'
import PlaySong from './PlaySong'
import useSoundEffect from '../hooks/useSoundEffect'
import { useNavigate } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react';

const Opening = () => {
    const playHoverSound = useSoundEffect('/music/effect/hover.flac');
    const playClickSound = useSoundEffect('/music/effect/select.mp3');
    const buttonTextArr: string[] = ['START', 'SAVED', 'EXIT'];
    const [selectedIndex, setSeletedIndex] = useState<number>(-1);
    const [pressedIndex, setPressedIndex] = useState<number>(-1);
    const navigate = useNavigate();

    const handleSelect = useCallback((_index: number) => {
        playClickSound();
        // playClickSound와 navigate 동시 발생 시 navigate가 작동을 하지않으므로 setTimeout 적용
        setTimeout(() => {
            navigate('/game');
        }, 100);
    }, [playClickSound, navigate]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // 최초 키 입력 시 START 버튼 선택
            if (selectedIndex === -1) {
                playHoverSound();
                setSeletedIndex(0);
                return;
            }

            switch (e.key) {
                case 'ArrowUp':
                case 'ArrowLeft':
                    playHoverSound();
                    setSeletedIndex(prev => prev === 0 ? buttonTextArr.length - 1 : prev - 1);
                    break;
                case 'ArrowDown':
                case 'ArrowRight':
                    playHoverSound();
                    setSeletedIndex(prev => prev === buttonTextArr.length - 1 ? 0 : prev + 1);
                    break;
                case 'Enter':
                    setPressedIndex(selectedIndex);
                    handleSelect(selectedIndex);
                    setTimeout(() => setPressedIndex(-1), 150);
                    break;
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIndex, playHoverSound, handleSelect]);
    

    return (
        <div className="app-background">
            <PlaySong src={'/music/bgm/opening.mp3'} loop={true} />
            <h1 className="game-title">geum soon</h1>
            <div className="select-box-group">
                {
                    buttonTextArr.map((text, index) => {
                        return (
                            <div key={index} className={`select-box-container${selectedIndex === index ? ' select-box-wrapper' : ''}`}>
                                <button
                                    className={`select-box${selectedIndex === index ? ' selected' : ''}${pressedIndex === index ? ' pressed' : ''}`}
                                    onClick={() => handleSelect(index)}
                                    onMouseEnter={() => {
                                        playHoverSound();
                                        setSeletedIndex(index);
                                    }}
                                >{text}</button>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Opening;