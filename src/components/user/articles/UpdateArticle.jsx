import React, { useEffect, useState } from 'react'
import useValidation from '../../custom/useValidation'
import ReactQuill from 'react-quill'
import Spinner from '../../layouts/Spinner'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { BASE_URL, getConfig, modules } from '../../../helpers/config'
import axios from 'axios'
import useTag from '../../custom/useTag'
import { toast } from 'react-toastify'
import { setCurrentUser } from '../../../redux/slices/userSlice'
import useTitle from '../../custom/useTitle'


export default function UpdateArticle() {
    const { isLoggedIn, token } = useSelector(state => state.user)
    const [article, setArticle] = useState({
        title: '',
        body: '',
        excerpt: '',
        image: ''
    })
    const [loading, setLoading] = useState(false)
    const [loadingData, setLoadingData] = useState(false)
    const [imageChanged, setImageChanged] = useState(false)
    const [error, setError] = useState('')
    const [errors, setErrors] = useState([])
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const fetchedTags = useTag()
    const [choosenTags, setChoosenTags] = useState([])
    const { slug } = useParams()

    //change page title
    useTitle('Update Article')

    useEffect(() => {
        if (!isLoggedIn) navigate('/login')
        const fetchArticleBySlug = async () => {
            setLoadingData(true)
            try {
              const response = await axios.get(`${BASE_URL}/articles/${slug}`)
                setArticle(response.data.data)
                response.data.data.tags.forEach(tag => setChoosenTags(
                    prevTags => [...prevTags, tag.id]
                ))
                setLoadingData(false)
            } catch (error) {
              if (error?.response?.status === 404) {
                setError('The article you are looking for does not exist.')
              }
              setLoadingData(false)
              console.log(error)
            }
        }
        fetchArticleBySlug()
      }, [isLoggedIn, slug])

    const handleTagsInputChange = (e) => {
        let exists = choosenTags.find(tag => tag === parseInt(e.target.value))
        if (exists) {
            const updatedTags = choosenTags.filter(tag => tag !== parseInt(e.target.value))
            setChoosenTags(updatedTags)
        }else {
            setChoosenTags([...choosenTags, parseInt(e.target.value)])
        }
    }

    const updateArticle = async (e) => {
        e.preventDefault()
        setLoading(true)
        setErrors([])

        const formData = new FormData()
        if (article.image !== undefined) {
            formData.append('image', article.image)
        }
        formData.append('title', article.title)
        formData.append('body', article.body)
        formData.append('excerpt', article.excerpt)
        formData.append('tags', choosenTags)
        formData.append('_method', 'put')

        try {
            const response = await axios.post(`${BASE_URL}/update/${slug}/article`, formData,
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
        <div className="container">
            {
                loadingData ? <div className="d-flex justify-content-center mt-3">
                    <Spinner />
                </div>
                :
                error ? <div className="row my-5">
                    <div className="col-md-6 mx-auto">
                        <div className="card">
                            <div className="card-body">
                                <div className="alert alert-danger my-3">
                                    { error }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            :
            <div className='row my-5'>
                <div className="col-md-6 mx-auto">
                    <div className="card shadow-sm">
                        <div className="card-header bg-white">
                            <h5 className="text-center mt-2">
                                Update article
                            </h5>
                        </div>
                        <div className="card-body">
                            <form className="mt-5" onSubmit={(e) => updateArticle(e)}>
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
                                        onChange={(e) => {
                                            setImageChanged(true)
                                            setArticle({
                                                ...article, image: e.target.files[0]
                                            })
                                        }}
                                        className="form-control" />
                                        { useValidation(errors, 'image')}
                                    {
                                        article?.image_path && imageChanged ?
                                            <img src={URL.createObjectURL(article.image)} 
                                                alt="image" 
                                                width={150}
                                                height={150}
                                                className='rounded my-2'/>
                                            :
                                            <img src={article.image_path} 
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
        }
        </div>
    )
}
