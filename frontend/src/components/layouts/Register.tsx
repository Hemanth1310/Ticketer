import React, { useState } from 'react'
import type { toggeler } from '../../types'
import { registerSchema } from '../../utils/typechecker'
import axios from '../../utils/authMiddleware'
import { AxiosError } from 'axios'
import { toast } from 'react-toastify'
type Props = {
     toggleTo:(val:toggeler)=>void,
    onClose:()=>void
}

const BASE_API_URL = import.meta.env.VITE_API_URL

const Register = ({toggleTo}: Props) => {
  const [errors, setErrors] = useState({
    email:"",
    password:"",
    firstName:"",
    lastName:"",
    api:""
  })

  const handleRegister = async(formData:FormData)=>{
    const registerData = Object.fromEntries(formData.entries())
    const parsedData = registerSchema.safeParse(registerData)

    if(!parsedData.success){
      for(const issue of parsedData.error.issues){
          setErrors(prev=>({...prev,[issue.path[0]]:issue.message}))
      }
      return
    }

    try{
      const response  = await axios.post(`${BASE_API_URL}/api/auth/register`,parsedData.data)
      if(!response.status){
        throw new Error("Unexpected Error Occured")
      }

      toast.success('Register Successful',{
                          position: "top-right",
                          autoClose: 5000,
                          hideProgressBar: false,
                          closeOnClick: false,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                          theme: "light",
      })
      toggleTo('login')

    }catch(err){
           if(err instanceof AxiosError){
                    setErrors(prev=>({...prev, apiResponse:err.response?.data.error}))
                    return
                }
                setErrors(prev=>({...prev, apiResponse:'Unexpected error occured.'}))
        }
  }
  return (
    <form action={handleRegister} className='w-full h-full pt-3 flex flex-col items-center gap-5'>
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
        <div className='w-full flex flex-col gap-1'>
            <label >Firstname:</label>
            <input type='name' name='firstName' className='w-full border-2 rounded-lg border-mist-200 text-lg p-1 pl-3'></input>
            {errors.firstName && <p className='text-xs text-red-500'>{errors.lastName}</p>}
        </div>
        <div className='w-full flex flex-col gap-1'>
            <label >Lastname:</label>
            <input type='text' name='lastName' className='w-full border-2 rounded-lg border-mist-200 text-lg p-1 pl-3'></input>
            {errors.lastName && <p className='text-xs text-red-500'>{errors.lastName}</p>}
        </div>
        {errors.api && <p className='text-xs text-red-500'>Register Failed: {errors.api}</p>}
        <button className='w-full h-10 p-1 bg-brand-primary hover:bg-brand-forth rounded-lg text-white'>Register</button>
        
        <p>Already Registered ? <span className='text-blue-500' onClick={()=>toggleTo('login')}>Login Here</span></p>
    </form>
  )
}

export default Register