import React, { useEffect, useState } from 'react'
import useValidation from '../custom/useValidation'
import ReactQuill from 'react-quill'
import Spinner from '../layouts/Spinner'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { BASE_URL, getConfig, modules } from '../../helpers/config'
import axios from 'axios'
import useTag from '../custom/useTag'
import useTitle from '../custom/useTitle'
import { toast } from 'react-toastify'

export default function Write() {
    const { isLoggedIn, token } = useSelector(state => state.user)
    const [article, setArticle] = useState({
        title: '',
        body: '',
        excerpt: '',
        image: ''
    })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState([])
    const navigate = useNavigate()
    const fetchedTags = useTag()
    const [choosenTags, setChoosenTags] = useState([])

    //change page title
    useTitle('Write')

    useEffect(() => {
        if (!isLoggedIn) navigate('/login')
      }, [isLoggedIn])

    const handleTagsInputChange = (e) => {
        let exists = choosenTags.find(tag => tag === e.target.value)
        if (exists) {
            const updatedTags = choosenTags.filter(tag => tag !== e.target.value)
            setChoosenTags(updatedTags)
        }else {
            setChoosenTags([...choosenTags, e.target.value])
        }
    }

    const storeArticle = async (e) => {
        e.preventDefault()
        setLoading(true)
        setErrors([])

        const formData = new FormData()
        formData.append('image', article.image)
        formData.append('title', article.title)
        formData.append('body', article.body)
        formData.append('excerpt', article.excerpt)
        formData.append('tags', choosenTags)

        try {
            const response = await axios.post(`${BASE_URL}/add/article`, formData,
            getConfig(token, 'multipart/form-data'))
            setLoading(false)
            toast.success(response.data.message)
            navigate('/')
          } catch (error) {
            setLoading(false)
            if (error?.response?.status === 422) {
              setErrors(error.response.data.errors)
            }
            console.log(error)
        }
    }
    return (
        <div className='row my-5'>
            <div className="col-md-6 mx-auto">
                <div className="card shadow-sm">
                    <div className="card-header bg-white">
                        <h5 className="text-center mt-2">
                            Add new article
                        </h5>
                    </div>
                    <div className="card-body">
                    <form className="mt-5" onSubmit={(e) => storeArticle(e)}>
                            <div className="mb-3">
                                <label htmlFor="title" className='form-label'>Title*</label>
                                <input 
                                    type="text" name='title' id='title'
                                    value={article.title}
                                    onChange={(e) => setArticle({
                                        ...article, title: e.target.value
                                    })}
                                    className="form-control" />
                                    { useValidation(errors, 'title')}
                                </div>
                            <div className="mb-3">
                                <label htmlFor="excerpt" className='form-label'>Excerpt*</label>
                                <textarea rows={5}
                                    cols={30}
                                    name='excerpt' 
                                    value={article.excerpt}
                                    onChange={(e) => setArticle({
                                        ...article, excerpt: e.target.value
                                    })}
                                    id='excerpt' 
                                    className="form-control"></textarea>
                                { useValidation(errors, 'excerpt')}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="body" className='form-label'>Body*</label>
                                <ReactQuill theme="snow" 
                                    value={article.body} 
                                    modules={modules}
                                    onChange={(value) => setArticle({
                                        ...article, body: value
                                    })} />
                                { useValidation(errors, 'body')}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="image" className="form-label">Image*</label>
                                <input 
                                    type="file" name="image" id='image'
                                    accept="image/*"
                                    onChange={(e) => setArticle({
                                        ...article, image: e.target.files[0]
                                    })}
                                    className="form-control" />
                                    { useValidation(errors, 'image')}
                                {
                                    article.image && 
                                        <img src={URL.createObjectURL(article.image)} 
                                            alt="image" 
                                            width={150}
                                            height={150}
                                            className='rounded my-2'/>
                                }
                            </div>
                            <div className="mb-3 d-flex flex-wrap">
                                {
                                    fetchedTags?.map(tag => (
                                        <div key={tag.id} className="form-check">
                                            <input type="checkbox" 
                                                id={tag.id}
                                                value={tag.id}
                                                checked={choosenTags.some(item => item == tag.id)} 
                                                onChange={(e) => handleTagsInputChange(e)} 
                                                className='form-check-input mx-1'    
                                            />
                                            <label htmlFor={tag.id} className='form-check-label'>
                                                { tag.name }
                                            </label>
                                        </div>
                                    )) 
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
    )
}
