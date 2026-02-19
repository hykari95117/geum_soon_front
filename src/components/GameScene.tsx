import { useState, useEffect, useCallback, useRef } from 'react'
import PlaySong from './PlaySong'
import '../styles/GamePage.css'
import useSoundEffect from '../hooks/useSoundEffect'

/**
 * Types
 */
// GameScene에 사용되는 props 중 dialogues(대화 및 지문)의 타입
export interface DialogueLine {
    character?: string
    text: string
    characterImage?: string
}
// GameScene 컴포넌트의 props
interface GameSceneProps {
    dialogues: DialogueLine[]   // 대화(대화 및 지문)
    backgroundUrl: string       // 배경 이미지
    bgm: string                 // 브금
    onComplete: () => void      // 해당 Scene 종료 시 실행될 함수
}

/**
 * Constants
 */
// 텍스트 타이핑 속도
const TYPEWRITER_SPEED_MS = 45

/**
 * Component
 */
const GameScene = ({ dialogues, backgroundUrl, bgm, onComplete }: GameSceneProps) => {
    // 현재 표시 중인 대사의 인덱스
    const [dialogueIndex, setDialogueIndex] = useState(0)
    // 타이핑 효과로 화면에 출력된 텍스트 (한 글자씩 누적)
    const [displayedText, setDisplayedText] = useState('')
    // 타이핑 애니메이션 진행 중 여부
    const [isTyping, setIsTyping] = useState(false)
    // 캐릭터 이미지 페이드인 완료 여부
    const [isCharacterVisible, setIsCharacterVisible] = useState(false)
    // 모든 대사를 끝까지 진행했는지 여부
    const [hasFinishedAll, setHasFinishedAll] = useState(false)

    // 타이핑 효과 setInterval ID (클리어용)
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
                e.stopPropagation()
                if (hasFinishedAll) {
                    onComplete()
                } else {
                    advanceDialogue()
                }
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [advanceDialogue, hasFinishedAll, onComplete])

    // -- Start typewriter on dialogue change ---------------------------------
    useEffect(() => {
        console.log(`Start typewriter on dialogue change`)
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

    // -- Save --------------------------------------------------------------
    const playHoverSound = useSoundEffect('/music/effect/save.wav');
    const clickSave = () => {
        console.log(`saved`)
        playHoverSound();
    }

    // -- Render --------------------------------------------------------------
    return (
        // 전체 씬 컨테이너 (클릭 시 대사 진행)
        <div className="scene-container" onClick={advanceDialogue}>
            {/* BGM 재생 */}
            <PlaySong src={bgm} loop={true} fadeIn={5000} />

            {/* 저장 아이콘 (우측 상단) */}
            <img
                src="/image/img_assets/save.png"
                alt="저장"
                className="scene-save-icon"
                onClick={(e) => {
                    e.stopPropagation()
                    clickSave()
                }}
            />

            {/* 배경 이미지 (전체 화면) */}
            <div
                className="scene-background"
                style={{ backgroundImage: `url(${backgroundUrl})` }}
            />

            {/* 하단 콘텐츠 영역 (캐릭터 + 대화상자) */}
            <div className="scene-content-wrapper">
                <div className="scene-content">
                    {/* 캐릭터 이미지 (대화창 좌측 상단에 겹쳐 배치) */}
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
                    {/* 대화상자 */}
                    <div className="scene-chat">
                        {/* 캐릭터 이름 태그 (우측 상단) */}
                        {currentLine.character && (
                            <div className="scene-name">{currentLine.character}</div>
                        )}

                        {/* 대사 텍스트 + 타이핑 커서 */}
                        <span>
                            {displayedText}
                            {isTyping && <span className="scene-typewriter-cursor">|</span>}
                        </span>

                        {/* 다음 대사 진행 표시 (▼) */}
                        {!isTyping && !hasFinishedAll && (
                            <span className="scene-click-indicator">▼</span>
                        )}

                        {/* 모든 대사 완료 후 씬 전환 버튼 */}
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
