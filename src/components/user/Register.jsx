import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import useValidation from '../custom/useValidation'
import Spinner from '../layouts/Spinner'
import { BASE_URL } from '../../helpers/config'
import { useSelector } from 'react-redux'
import useTitle from '../custom/useTitle'

export default function Register() {
  const { isLoggedIn } = useSelector(state => state.user)
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  //change page title
  useTitle('Register')

  useEffect(() => {
    if (isLoggedIn) navigate('/')
  }, [isLoggedIn])

  const registerUser = async(e) => {
    e.preventDefault()
    setLoading(true)
    setErrors([])
    try {
      const response = await axios.post(`${BASE_URL}/user/register`, user)
      setLoading(false)
      toast.success(response.data.message)
      navigate('/login')
    } catch (error) {
      setLoading(false)
      if (error?.response?.status === 422) {
        setErrors(error.response.data.errors)
      }
      console.log(error)
    }
  }

  return (
    <div className='container'>
      <div className="row my-5">
        <div className="col-md-6 mx-auto">
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <h5 className="text-center mt-2">
                Register
              </h5>
            </div>
            <div className="card-body">
              <form className="mt-5" onSubmit={(e) => registerUser(e)}>
                <div className="mb-3">
                  <label htmlFor="name" className='form-label'>Name*</label>
                  <input 
                    type="text" name='name' id='name'
                    onChange={(e) => setUser({
                      ...user, name: e.target.value
                    })}
                    className="form-control" />
                    { useValidation(errors, 'name')}
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className='form-label'>Email*</label>
                  <input type="email" name='email' 
                    onChange={(e) => setUser({
                      ...user, email: e.target.value
                    })}
                    id='email' className="form-control" />
                   { useValidation(errors, 'email')}
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className='form-label'>Password*</label>
                  <input type="password" name='password' 
                    onChange={(e) => setUser({
                      ...user, password: e.target.value
                    })}
                    id='password' className="form-control" />
                   { useValidation(errors, 'password')}
                </div>
                <div className="mb-3">
                  {
                    loading ?
                      <Spinner />
                    :
                    <button type="submit" className='btn btn-sm btn-dark'>
                      Submit
                    </button>
                  }
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
