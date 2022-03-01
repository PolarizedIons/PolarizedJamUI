import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { Stage } from 'react-konva'
import { RecoilRoot } from 'recoil'
import App from './App'
import './main.css'

ReactDOM.render(
  <StrictMode>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </StrictMode>,
  document.getElementById('root')
)
