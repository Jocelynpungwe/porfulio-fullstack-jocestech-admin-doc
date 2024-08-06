import { Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser } from '../features/user/userSlice'

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch()
  const { user } = useSelector((store) => store.user)

  if (!user) {
    return <Navigate to="/admin/landing" />
  }

  if (user.role !== 'admin') {
    dispatch(logoutUser('Invalid Credential'))
    return <Navigate to="/admin/landing" />
  }

  return children
}

export default ProtectedRoute
