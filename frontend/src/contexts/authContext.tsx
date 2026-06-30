/* eslint-disable react-refresh/only-export-components */
import {  createContext, useEffect, useState } from "react";
import type { User } from "../utils/typechecker";
import axios, { AxiosError } from "axios";

type AuthContextType = {
    userDetails:User|null,
    updateUserDetails:(userData:User|null)=>void,
    isLoading:boolean,
    logout:()=>void
}


const defalutAuthContextType = {
    userDetails:null,
    updateUserDetails:()=>{},
    isLoading:true,
    logout:()=>{}
}

const hasAuthCookie = () =>
    document.cookie
        .split(';')
        .some((cookie) => cookie.trim().startsWith('hasAuth='))

export const AuthContext = createContext<AuthContextType>(defalutAuthContextType)

const BASE_API_URL = import.meta.env.VITE_API_URL

export const AuthContextProivder = ({children}:{children:React.ReactNode})=>{
    const [userDetails, setUserDetails] = useState<User|null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const  updateUserDetails = (userData:User|null)=>{
        setUserDetails(userData)
        setIsLoading(false)
    }

    const logout = ()=>{
        setUserDetails(null)
        setIsLoading(false)
    }

        useEffect(()=>{
        if(!hasAuthCookie()){
            return
        }

        const tokenValidator = async()=>{

            try{
                const {data} = await axios.get(`${BASE_API_URL}/api/private/user-details`)

                if(data?.payload){
                   updateUserDetails(data?.payload)
                }else{
                    setIsLoading(false)
                }
                
            }catch(err){
                if(err instanceof AxiosError){
                    console.log(err.response?.data?.error)
                }else{
                    console.log("Unexpected Error occured")
                }
                setIsLoading(false)
            }
        }
        tokenValidator()

    },[])
    return <AuthContext.Provider value={{userDetails, isLoading, updateUserDetails, logout}}>
        {children}
    </AuthContext.Provider>

}


