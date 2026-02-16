import { Route, Routes } from 'react-router-dom'
import IntroPage from './components/IntroPage'
import Opening from './components/Opening'
import GamePage from './components/GamePage'


function App() {
  return (
    <Routes>
      <Route path={'/'} element={<IntroPage/>}></Route>
      <Route path={'/opening'} element={<Opening/>}></Route>
      <Route path={'/game'} element={<GamePage/>}></Route>
    </Routes>
  )
}

export default App