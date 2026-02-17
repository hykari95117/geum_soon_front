import { Route, Routes } from 'react-router-dom'
import IntroPage from './components/IntroPage'
import Opening from './components/Opening'
import GamePage from './components/GamePage'
import GamePage2 from './components/GamePage2'


function App() {
  return (
    <Routes>
      <Route path={'/'} element={<IntroPage/>}></Route>
      <Route path={'/opening'} element={<Opening/>}></Route>
      <Route path={'/game'} element={<GamePage/>}></Route>
      <Route path={'/game2'} element={<GamePage2/>}></Route>
    </Routes>
  )
}

export default App