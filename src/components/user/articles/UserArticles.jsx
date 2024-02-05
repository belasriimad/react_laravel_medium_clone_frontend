import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { setCurrentUser } from '../../../redux/slices/userSlice'
import { toast } from 'react-toastify'
import axios from 'axios'
import { BASE_URL, getConfig } from '../../../helpers/config'
import Spinner from '../../layouts/Spinner'

export default function UserArticles() {
    const { token } = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    useEffect(() => {
        fetchUserArticles()
    }, [])

    const fetchUserArticles = async () => {
        setMessage('')
        setLoading(true)
        try {
            const response = await axios.get(`${BASE_URL}/user/articles`,
              getConfig(token))
              if (response.data.data.length) {
                setArticles(response.data.data)
              }else {
                setMessage('No articles found')
              }
              setLoading(false)
            } catch (error) {
                setLoading(false)
                console.log(error)
        }
    }

    const deleteArticle = async (slug) => {
        try {
            const response = await axios.delete(`${BASE_URL}/delete/${slug}/article`,
              getConfig(token))
              if (response.data.error) {
                toast.error(response.data.error)
              }else {
                dispatch(setCurrentUser(response.data.user))
                toast.success(response.data.message)
                fetchUserArticles()
              }
            } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="col-md-9">
            {
                loading ?
                    <div className="d-flex justify-content-center">
                        <Spinner />
                    </div>
                :
                message ?
                    <div className="alert alert-info">
                        { message }
                    </div>
                :
                    <table className='table table-responsive'>
                        <caption>List of published articles</caption>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Image</th>
                                <th>Title</th>
                                <th>Claps</th>
                                <th>Published</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                articles.map((article, index) => (
                                    <tr key={index}>
                                        <td>
                                            { index += 1}
                                        </td>
                                        <td>
                                            <img src={article.image_path} 
                                                width={60}
                                                height={60}
                                                className='rounded'
                                                alt={article.title}
                                            />
                                        </td>
                                        <td>
                                            { article.title }
                                        </td>
                                        <td>
                                            { article.clapsCount }
                                        </td>
                                        <td>
                                            { article.created_at }
                                        </td>
                                        <td>
                                            <Link className='btn btn-sm btn-warning' 
                                                to={`/update/article/${article.slug}`}>
                                                <i className="bi bi-pen"></i>
                                            </Link>
                                            <button className="btn btn-sm btn-danger ms-1"
                                                onClick={() => {
                                                    if (confirm("Are you sure that you want to delete this article ?")) {
                                                        deleteArticle(article.slug)
                                                    }
                                                }}>
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
            }
        </div>
    )
}
