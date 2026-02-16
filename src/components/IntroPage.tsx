import '../styles/IntroPage.css'
import { useNavigate } from 'react-router-dom'

const IntroPage = () => {
    const navigate = useNavigate();
    const goToOpening = () => {
        // 키 입력은 Enter || space bar 입력 시 넘어간다.
        window.onkeydown = (e) => {
            if(e.key === 'Enter' || e.key === ' ') {
                navigate('/opening');
            }
        }
        // 마우스 클릭
        window.onclick = () => {
            navigate('/opening');
        }
    }

    return (
        <div className="click-to-start" onClick={goToOpening} onKeyDown={goToOpening}>
            <p className="click-text">CLICK TO START</p>
        </div>
    )
}

export default IntroPage;