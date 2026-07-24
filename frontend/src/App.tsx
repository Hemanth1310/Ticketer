
import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import Header from './components/layouts/Header'
import Home from './views/Home'
import { ToastContainer } from 'react-toastify'

function App() {

  return (
  <BrowserRouter>
    <div className='w-screen min-h-screen flex flex-col text-mist-900 bg-mist-50'>
      <Header/>
      <div className="mt-16 p-5 flex-1 w-full h-full flex gap-5 bg-mist-50 rounded-2xl">
          <div className="min-h-full w-full rounded-2xl p-5 box-border">
            <Routes>
              <Route path="/" element={<Home/>}></Route>
             
            </Routes>
          </div> 
        </div>
      <ToastContainer/>
    </div>
    
  </BrowserRouter>
  )
}

export default App
