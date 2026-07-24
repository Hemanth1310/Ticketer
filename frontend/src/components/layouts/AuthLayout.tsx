import { useState } from 'react'
import Modal from './Modal'
import Login from './Login'
import Register from './Register'
import type { toggeler } from '../../types'
type Props = {
    isOpen: boolean,
    onClose:()=>void
}



const AuthLayout = ({isOpen, onClose}: Props) => {

   const [toggle,setToggle] = useState<toggeler>('login')
   
   const title = toggle==='login'?'Login':'Register'
   const ActiveComponent = toggle==='login'? Login:Register

   const toggleTo =(val:toggeler)=>{
        setToggle(val)
   }
  return (
    <Modal onClose={onClose} isOpen={isOpen} title={title}>
        <ActiveComponent toggleTo={toggleTo} onClose={onClose}/>
    </Modal>
  )
}

export default AuthLayout