import { useState, useEffect, useCallback, useRef } from 'react'
import PlaySong from './PlaySong'
import '../styles/GamePage.css'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DialogueLine {
    character?: string
    text: string
    characterImage?: string
}

// ---------------------------------------------------------------------------
// Dialogue Data
// ---------------------------------------------------------------------------

const DIALOGUE_DATA: DialogueLine[] = [
    {
        text: '넓은 들판에 형형색색의 꽃들이 가득 피어 있다.',
    },
    {
        character: '철수',
        text: '와... 여기 꽃이 정말 예쁘다!',
        characterImage: '/image/character/char8.webp',
    },
    {
        character: '철수',
        text: '금순 누나가 약초를 구하러 간다고 했는데... 이 근처일까?',
        characterImage: '/image/character/char8.webp',
    },
    {
        text: '철수는 꽃밭 사이로 난 좁은 길을 따라 걸어가기 시작했다.',
    },
    {
        character: '철수',
        text: '저기... 누군가 오고 있는 것 같은데?',
        characterImage: '/image/character/char8.webp',
    },
]

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BACKGROUND_URL = '/image/background/scene2/scene2.png'
const TYPEWRITER_SPEED_MS = 45

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const GamePage2 = () => {
    const [dialogueIndex, setDialogueIndex] = useState(0)
    const [displayedText, setDisplayedText] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [isCharacterVisible, setIsCharacterVisible] = useState(false)
    const [hasFinishedAll, setHasFinishedAll] = useState(false)

    const typewriterRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const currentLine = DIALOGUE_DATA[dialogueIndex]

    // -- Typewriter Effect ---------------------------------------------------
    const startTypewriter = useCallback((text: string) => {
        if (typewriterRef.current) {
            clearInterval(typewriterRef.current)
        }

        setDisplayedText('')
        setIsTyping(true)

        let charIndex = 0

        typewriterRef.current = setInterval(() => {
            charIndex += 1
            setDisplayedText(text.slice(0, charIndex))

            if (charIndex >= text.length) {
                if (typewriterRef.current) {
                    clearInterval(typewriterRef.current)
                    typewriterRef.current = null
                }
                setIsTyping(false)
            }
        }, TYPEWRITER_SPEED_MS)
    }, [])

    // -- Skip to full text ---------------------------------------------------
    const completeTypewriter = useCallback(() => {
        if (typewriterRef.current) {
            clearInterval(typewriterRef.current)
            typewriterRef.current = null
        }
        setDisplayedText(currentLine.text)
        setIsTyping(false)
    }, [currentLine])

    // -- Advance Dialogue ----------------------------------------------------
    const advanceDialogue = useCallback(() => {
        if (hasFinishedAll) return

        if (isTyping) {
            completeTypewriter()
            return
        }

        const nextIndex = dialogueIndex + 1
        if (nextIndex >= DIALOGUE_DATA.length) {
            setHasFinishedAll(true)
            return
        }

        setDialogueIndex(nextIndex)
    }, [dialogueIndex, isTyping, hasFinishedAll, completeTypewriter])

    // -- Keyboard Support ----------------------------------------------------
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                advanceDialogue()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [advanceDialogue])

    // -- Start typewriter on dialogue change ---------------------------------
    useEffect(() => {
        const line = DIALOGUE_DATA[dialogueIndex]
        startTypewriter(line.text)

        if (line.characterImage) {
            if (!isCharacterVisible) {
                requestAnimationFrame(() => setIsCharacterVisible(true))
            }
        }

        return () => {
            if (typewriterRef.current) {
                clearInterval(typewriterRef.current)
                typewriterRef.current = null
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dialogueIndex, startTypewriter])

    // -- Determine current character image -----------------------------------
    const visibleCharacterImage = (() => {
        for (let i = dialogueIndex; i >= 0; i--) {
            if (DIALOGUE_DATA[i].characterImage) {
                return DIALOGUE_DATA[i].characterImage
            }
        }
        return undefined
    })()

    // -- Render --------------------------------------------------------------
    return (
        <div className="scene-container" onClick={advanceDialogue}>
            <PlaySong src="/music/bgm/in_office.mp3" loop={true} fadeIn={5000} />

            <div
                className="scene-background"
                style={{ backgroundImage: `url(${BACKGROUND_URL})` }}
            />

            <div className="scene-content-wrapper">
                <div className="scene-content">
                    {visibleCharacterImage && (
                        <img
                            src={visibleCharacterImage}
                            alt={currentLine.character ?? '캐릭터'}
                            className={
                                'scene-character-image' +
                                (isCharacterVisible ? ' scene-character-enter' : '')
                            }
                        />
                    )}
                    <div className="scene-chat">
                        {currentLine.character && (
                            <div className="scene-name">{currentLine.character}</div>
                        )}

                        <span>
                            {displayedText}
                            {isTyping && <span className="scene-typewriter-cursor">|</span>}
                        </span>

                        {!isTyping && !hasFinishedAll && (
                            <span className="scene-click-indicator">▼</span>
                        )}

                        {hasFinishedAll && (
                            <span className="scene-click-indicator">계속하기</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GamePage2
