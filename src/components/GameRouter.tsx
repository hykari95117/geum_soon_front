import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import GameScene from './GameScene'
import { scenes } from '../data/scenes'

/**
 * GameRouter manages scene progression via state rather than URL routing.
 *
 * - Tracks the current scene index in local state.
 * - Passes a `key` prop so GameScene fully remounts on scene transitions,
 *   resetting all internal state (dialogue index, typewriter, etc.).
 * - Navigates to '/' when the final scene completes.
 */
const GameRouter = () => {
    const navigate = useNavigate()
    const [currentSceneIndex, setCurrentSceneIndex] = useState(0)

    const handleSceneComplete = useCallback(() => {
        const nextIndex = currentSceneIndex + 1

        if (nextIndex >= scenes.length) {
            navigate('/')
            return
        }

        setCurrentSceneIndex(nextIndex)
    }, [currentSceneIndex, navigate])

    const currentScene = scenes[currentSceneIndex]

    return (
        <GameScene
            key={currentSceneIndex}
            dialogues={currentScene.dialogues}
            backgroundUrl={currentScene.backgroundUrl}
            bgm={currentScene.bgm}
            onComplete={handleSceneComplete}
        />
    )
}

export default GameRouter
