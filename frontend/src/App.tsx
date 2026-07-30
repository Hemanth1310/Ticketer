
import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import Header from './components/layouts/Header'
import Home from './views/Home'
import { ToastContainer } from 'react-toastify'
import MovieDetails from './views/MovieDetails'

function App() {

  return (
  <BrowserRouter>
    <div className='w-screen min-h-screen flex flex-col text-mist-900 bg-mist-50 font-mono'>
      <Header/>
      <div className="mt-16 flex-1 w-full h-full flex gap-5 bg-mist-50 rounded-2xl justify-center">
          <div className="min-h-full w-full rounded-2xl box-border container flex pt-5 pb-5">
              <Routes>
                <Route path="/" element={<Home/>}></Route>
                <Route path="/movie/:id" element={<MovieDetails/>}/>
              
              </Routes>

          </div> 
        </div>
      <ToastContainer/>
    </div>
    
  </BrowserRouter>
  )
}

export default App
