import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import useValidation from '../custom/useValidation'
import Spinner from '../layouts/Spinner'
import axios from 'axios'
import { BASE_URL, getConfig } from '../../helpers/config'
import { toast } from 'react-toastify'
import useTitle from '../custom/useTitle'

export default function UpdatePassword() {
    const { token, isLoggedIn } = useSelector(state => state.user)
    const navigate = useNavigate()
    const [newPassword, setNewPassword] = useState('')
    const [currentPassword, setCurrentPassword] = useState('')
    const [errors, setErrors] = useState([])
    const [loading, setLoading] = useState(false)

    //change page title
    useTitle('Update Password')

    useEffect(() => {
        if (!isLoggedIn) navigate('/login') 
    }, [isLoggedIn])

    const updatePassword = async (e) => {
        e.preventDefault()
        setErrors([])
        setLoading(true)

        const data = { currentPassword, newPassword}

        try {
            const response = await axios.put(`${BASE_URL}/update/password`, data,
            getConfig(token))

            if (response.data.error) {
                setLoading(false)
                toast.error(response.data.error)
            }else {
                setLoading(false)
                setCurrentPassword('')
                setNewPassword('')
                toast.success(response.data.message)
                navigate('/profile')
            }

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
                    <div className="card">
                        <div className="card-header bg-white text-center">
                            <h4 className="mt-2">
                                Update your password
                            </h4>
                        </div>
                        <div className="card-body">
                            <form className="mt-5" onSubmit={(e) => updatePassword(e)}>
                                <div className="mb-3">
                                    <label htmlFor="currentPassword" className='form-label'>Current Password*</label>
                                    <input 
                                        type="password" name='currentPassword' id='currentPassword'
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="form-control" />
                                        { useValidation(errors, 'currentPassword')}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="newPassword" className='form-label'>New Password*</label>
                                    <input 
                                        type="password" name='newPassword' id='newPassword'
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="form-control" />
                                        { useValidation(errors, 'newPassword')}
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
