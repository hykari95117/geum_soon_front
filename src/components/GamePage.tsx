import PlaySong from './PlaySong'
import '../styles/GamePage.css'

const backgroundUrl = '/image/background/office.png'

const GamePage = () => {
    return (
        <div className={'scene-container'}>
            {/* 5초에 걸쳐 음악이 서서히 커진다. 5초가 지나면 볼륨 100%로 재생 */}
            <PlaySong src={'/music/bgm/in_office.mp3'} loop={true} fadeIn={5000}/>
            <div className={'scene-background'} style={{
                backgroundImage: `url(${backgroundUrl})`
            }}></div>
        </div>
    )
}

export default GamePage;