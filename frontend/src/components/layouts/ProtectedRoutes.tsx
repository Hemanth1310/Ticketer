import { Outlet, useNavigate } from 'react-router'
import { useAuthContextData } from '../../utils/useAuthContextData'
import Loading from './Loading'

const ProtectedRoutes = () => {

    const {userDetails, isLoading} = useAuthContextData()
    const navigate = useNavigate()
    if(isLoading){
        return <Loading/>
    }
    if(!userDetails){
        navigate('/')
    }
  return (
    <Outlet/>
  )
}

export default ProtectedRoutes