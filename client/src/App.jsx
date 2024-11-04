
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import ProfilePage from './pages/ProfilePage'
import ChatPage from './pages/ChatPage'
import {Toaster} from 'react-hot-toast'
import { useAuthStore } from './store/useAuthStore'
import { useEffect } from 'react'
function App() {
  const {authUser,checkAuth,checkingAuth} = useAuthStore();
  useEffect(() => {
		checkAuth();
	}, [checkAuth]);
  if(checkingAuth) return null;
  return (
    <div className="absolute inset-0 -z-10 h-full bg-white w-full bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] ">
        <Routes>
            <Route path="/" element={authUser ? <HomePage/> : <Navigate to="/auth"/>}/>
            <Route path="/auth" element={authUser ? <Navigate to="/"/> : <AuthPage/>}/>
            <Route path="/profile" element={authUser ? <ProfilePage/> : <Navigate to="/auth"/>}/>
            <Route path="/chat/:id" element={authUser ? <ChatPage/> : <Navigate to="/auth"/>}/>
        </Routes>        
        <Toaster/>
    </div>
  )
}

export default App
