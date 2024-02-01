import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Sidebar from './partials/Sidebar'
import UserArticles from './articles/UserArticles'
import useTitle from '../custom/useTitle'

export default function Profile() {
  const { isLoggedIn } = useSelector(state => state.user)
  const navigate = useNavigate()

  //change page title
  useTitle('Profile')

  useEffect(() => {
    if (!isLoggedIn) navigate('/login')
  }, [isLoggedIn])

  return (
    <div className='container'>
      <div className="row my-5">
        <Sidebar />
        <UserArticles />
      </div>
    </div>
  )
}
