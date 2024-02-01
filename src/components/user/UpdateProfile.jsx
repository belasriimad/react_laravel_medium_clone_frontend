import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import useValidation from '../custom/useValidation'
import Spinner from '../layouts/Spinner'
import { setCurrentUser } from '../../redux/slices/userSlice'
import axios from 'axios'
import { BASE_URL, getConfig } from '../../helpers/config'
import { toast } from 'react-toastify'
import useTitle from '../custom/useTitle'

export default function UpdateProfile() {
    const { user, token, isLoggedIn } = useSelector(state => state.user)
    const navigate = useNavigate()
    const [data, setData] = useState({
        name: user?.name,
        email: user?.email,
        bio: user?.bio || ''
    })
    const [errors, setErrors] = useState([])
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)

    //change page title
    useTitle('Update Profile')

    useEffect(() => {
        if (!isLoggedIn) navigate('/login') 
    }, [isLoggedIn])

    const updateProfile = async (e) => {
        e.preventDefault()
        setErrors([])
        setLoading(true)

        const formData = new FormData()
        if (data.image !== undefined) {
            formData.append('image', data.image)
        }
        formData.append('name', data.name)
        formData.append('email', data.email)
        formData.append('bio', data.bio)
        formData.append('_method', 'put')

        try {
            const response = await axios.post(`${BASE_URL}/update/profile`, formData,
            getConfig(token, 'multipart/form-data'))

            dispatch(setCurrentUser(response.data.user))
            setLoading(false)
            toast.success(response.data.message)
            navigate('/profile')

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
                                Update your profile
                            </h4>
                        </div>
                        <div className="card-body">
                            <form className="mt-5" onSubmit={(e) => updateProfile(e)}>
                                <div className="mb-3">
                                    <label htmlFor="name" className='form-label'>Name*</label>
                                    <input 
                                        type="text" name='name' id='name'
                                        value={data.name}
                                        onChange={(e) => setData({
                                            ...data, name: e.target.value
                                        })}
                                        className="form-control" />
                                        { useValidation(errors, 'name')}
                                    </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className='form-label'>Email*</label>
                                    <input 
                                        type="email" name='email' id='email'
                                        value={data.email}
                                        onChange={(e) => setData({
                                            ...data, email: e.target.value
                                        })}
                                        className="form-control" />
                                    { useValidation(errors, 'email')}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="bio" className='form-label'>Bio</label>
                                    <textarea rows={5}
                                        cols={30}
                                        name='bio' 
                                        value={data.bio}
                                        onChange={(e) => setData({
                                            ...data, bio: e.target.value
                                        })}
                                        id='bio' 
                                        className="form-control"></textarea>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="image" className="form-label">Image</label>
                                    <input 
                                        type="file" name="image" id='image'
                                        accept="image/*"
                                        onChange={(e) => 
                                            setData({
                                                ...data, image: e.target.files[0]
                                            })
                                        }
                                        className="form-control" />
                                        { useValidation(errors, 'image')}
                                    {
                                        data?.image && 
                                            <img src={URL.createObjectURL(data.image)} 
                                                alt="image" 
                                                width={150}
                                                height={150}
                                                className='rounded my-2'/>
                                    }
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
