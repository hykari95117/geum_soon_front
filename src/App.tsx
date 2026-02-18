import { Route, Routes } from 'react-router-dom'
import IntroPage from './components/IntroPage'
import Opening from './components/Opening'
import GameRouter from './components/GameRouter'
import Credits from './components/Credits'


function App() {
  return (
    <Routes>
      <Route path={'/'} element={<IntroPage/>}></Route>
      <Route path={'/opening'} element={<Opening/>}></Route>
      <Route path={'/game'} element={<GameRouter/>}></Route>
      <Route path={'/credits'} element={<Credits/>}></Route>
    </Routes>
  )
}

export default App
