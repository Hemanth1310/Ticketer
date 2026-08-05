import React, { useState } from 'react'
import type { toggeler } from '../../types'
import { loginSchema, userSchema } from '../../utils/typechecker'
import axios from '../../utils/authMiddleware'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'
import { useAuthContextData } from '../../utils/useAuthContextData'
// import { useNavigate } from 'react-router'
type Props = {
     toggleTo:(val:toggeler)=>void,
    onClose:()=>void
}

const BASE_API_URL = import.meta.env.VITE_API_URL

const Login = ({toggleTo, onClose}: Props) => {

  const [errors, setErrors] = useState({
    email:'',
    password:'',
    api:''
  })
  const {updateUserDetails} = useAuthContextData()
  // const navigate=useNavigate()


  const handleLogin=async(formData:FormData)=>{
    const authData = Object.fromEntries(formData.entries())
    const parsedData = loginSchema.safeParse(authData)
    

    if(!parsedData.success){
      for(const issue of parsedData.error.issues){
        setErrors(prev=>({...prev,[issue.path[0]]:issue.message}))
      }
      return
    }

    try{
      const response = await axios.post(`${BASE_API_URL}/api/auth/login`,parsedData.data)
        if(!response.status){
          throw new Error("Unexpected Error Occured")
        }

        const parsedUserData = userSchema.safeParse(response.data.payload)

        if(!parsedUserData.success){
          console.log(parsedUserData.error.issues)
          throw new Error('Unexpected error occured.')
        }
            toast.success('Login Successful',{
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
            })

        updateUserDetails(parsedUserData.data)
        // navigate('/')
        onClose()
        
      
    }catch(err){
       if(err instanceof AxiosError){
                setErrors(prev=>({...prev, api:err.response?.data.error}))
                return
            }
            setErrors(prev=>({...prev, api:'Unexpected error occured.'}))
    }
  }
  return (
      <form action={handleLogin} className='w-full h-full pt-3 flex flex-col items-center gap-5'>
        <div className='w-full flex flex-col gap-1'>
            <label >Username:</label>
            <input type='email' name='email' className='w-full border-2 rounded-lg border-mist-200 text-lg p-1 pl-3'></input>
            {errors.email && <p className='text-xs text-red-500'>{errors.email}</p>}
        </div>
        <div className='w-full flex flex-col gap-1'>
            <label >Password:</label>
            <input type='password' name='password' className='w-full border-2 rounded-lg border-mist-200 text-lg p-1 pl-3'></input>
             {errors.password && <p className='text-xs text-red-500'>{errors.password}</p>}
        </div>
        {errors.api && <p className='text-xs text-red-500'>Login Failed: {errors.api}</p>}
        <button className='w-full h-10 p-1 bg-brand-primary hover:bg-brand-forth rounded-lg text-white'>Login</button>
        
        <p>Not registered ? <span className='text-blue-500' onClick={()=>toggleTo('register')}>Register Here</span></p>
    </form>
  )
}

export default Login