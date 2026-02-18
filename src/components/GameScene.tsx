import { useState, useEffect, useCallback, useRef } from 'react'
import PlaySong from './PlaySong'
import '../styles/GamePage.css'
import useSoundEffect from '../hooks/useSoundEffect'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DialogueLine {
    character?: string
    text: string
    characterImage?: string
}

interface GameSceneProps {
    dialogues: DialogueLine[]
    backgroundUrl: string
    bgm: string
    onComplete: () => void
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TYPEWRITER_SPEED_MS = 45

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const GameScene = ({ dialogues, backgroundUrl, bgm, onComplete }: GameSceneProps) => {
    const [dialogueIndex, setDialogueIndex] = useState(0)
    const [displayedText, setDisplayedText] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [isCharacterVisible, setIsCharacterVisible] = useState(false)
    const [hasFinishedAll, setHasFinishedAll] = useState(false)

    const typewriterRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const currentLine = dialogues[dialogueIndex]

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
        if (nextIndex >= dialogues.length) {
            setHasFinishedAll(true)
            return
        }

        setDialogueIndex(nextIndex)
    }, [dialogueIndex, dialogues.length, isTyping, hasFinishedAll, completeTypewriter])

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
        const line = dialogues[dialogueIndex]
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
            if (dialogues[i].characterImage) {
                return dialogues[i].characterImage
            }
        }
        return undefined
    })()

    // -- Sound --------------------------------------------------------------
    const playHoverSound = useSoundEffect('/music/effect/save.wav');
    const clickSave = () => {
        console.log(`saved`)
        playHoverSound();
    }

    // -- Render --------------------------------------------------------------
    return (
        <div className="scene-container" onClick={advanceDialogue}>
            <PlaySong src={bgm} loop={true} fadeIn={5000} />

            <img
                src="/image/img_assets/save.png"
                alt="저장"
                className="scene-save-icon"
                onClick={(e) => {
                    e.stopPropagation()
                    clickSave()
                }}
            />

            <div
                className="scene-background"
                style={{ backgroundImage: `url(${backgroundUrl})` }}
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
                            <span
                                className="scene-click-indicator"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onComplete()
                                }}
                            >
                                계속하기
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GameScene
