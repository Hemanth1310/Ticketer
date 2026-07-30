import { useRef, useState } from "react"
import AuthLayout from "./AuthLayout"
import { useAuthContextData } from "../../utils/useAuthContextData"
import {ChevronDown, ChevronUp, CircleUserRound, LogOut, Menu, Ticket} from 'lucide-react'
// import { NavLink } from "react-router-dom"
const Header = () => {
  const {userDetails,logout} = useAuthContextData()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDropDownOpen, setIsDropDownOpen] = useState(false)
  const dropDownRef = useRef<HTMLDivElement>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  

  const closeModal=() =>{
    setIsModalOpen(false)
  }

  const onLogout=()=>{
    setIsDropDownOpen(false)
    logout()
  }

  return (
    <div className="flex-1 w-screen h-16 bg-mist-50 border-b-gray-300 border-b-2 flex items-center justify-center fixed top-0 left-0 z-100 pr-5 pl-5 font-mono ">
      <div className="container flex items-center justify-between">
       <div className='flex sm:hidden' onClick={()=>setIsMenuOpen(prev=>!prev)}>
            <Menu />
        </div>
      <div className="h-full flex gap-2 justify-center items-center">
        <Ticket size={38} color="#BE1A1A"/>
        <p className="text-xl">Tickter</p>
      </div>
      <div>
                   {userDetails?
            <div className='flex gap-5 items-center'>
                
                   {isMenuOpen && 
                   
                   <div className='absolute top-0 left-0 w-screen h-screen z-100 bg-mist-50 shadow-md border border-mist-200 p-5 rounded-lg flex flex-col'>
                          <div className='flex justify-between'>
                              <div className='h-8 flex gap-2 items-center'>
                                  <Ticket/>
                                  <div className='text-xl'>
                                    Job/seeker
                                  </div>
                              </div>
                              <div onClick={()=>setIsMenuOpen(false)}>X</div>
                          </div>
                    </div>}
                  <div ref={dropDownRef} className='relative flex items-center' onClick={(e)=>{e.stopPropagation();setIsDropDownOpen(prev=>!prev)}}>
                    <CircleUserRound size={28}/>
                    {isDropDownOpen?<ChevronUp size={18}/>:<ChevronDown size={18}/>}
                    {isDropDownOpen && <div className='absolute top-8 right-0 bg-mist-50 shadow-md border border-mist-200 p-5 rounded-lg flex flex-col'>
                       <button className='flex items-center text-red-500 hover:border-b-2 hover:border-b-brand-primary' onClick={onLogout}>
                          <LogOut />
                          Logout
                        </button>
                    </div>}
                  </div>
                  
                  {/* */}
            </div>: <div>
                 <div>
              <button className='hover:border-b-2 hover:border-b-brand-primary' onClick={()=>setIsModalOpen(true)}>Login</button>
            </div>
            </div>
          }
      </div>
     
      <AuthLayout
      isOpen={isModalOpen}
      onClose={closeModal}
      />
      </div>
    </div>
  )
}

export default Header