import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL, getConfig } from '../../helpers/config'
import Spinner from '../layouts/Spinner'
import { useDispatch, useSelector } from 'react-redux'
import { Parser } from 'html-to-react'
import { setCurrentUser } from '../../redux/slices/userSlice'
import { bookmark } from '../../redux/slices/bookmarkSlice'
import useTitle from '../custom/useTitle'

export default function Article() {
    const { isLoggedIn, token, user} = useSelector(state => state.user)
    const { bookmarked } = useSelector(state => state.bookmark)
    const [article, setArticle] = useState(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { slug } = useParams()
    const dispatch = useDispatch()
    const exists = bookmarked.find(item => item.id === article?.id)


    //change page title
    useTitle(`${article?.title ? article?.title : ''}`)

    useEffect(() => {
        const fetchArticleBySlug = async () => {
            setLoading(true)
            try {
              const response = await axios.get(`${BASE_URL}/articles/${slug}`)
                setArticle(response.data.data)
                setLoading(false)
            } catch (error) {
              if (error?.response?.status === 404) {
                setError('The article you are looking for does not exist.')
              }
              setLoading(false)
              console.log(error)
            }
        }
        fetchArticleBySlug()
    }, [slug])

    const followUser = async (follower_id, following_id) => {
        try {
            const response = await axios.post(`${BASE_URL}/user/follow`, {
                follower_id, following_id
            }, getConfig(token))
              article.user = response.data.following
              dispatch(setCurrentUser(response.data.follower))
            } catch (error) {
            console.log(error)
        }
    }

    const unfollowUser = async (follower_id, following_id) => {
        try {
            const response = await axios.post(`${BASE_URL}/user/unfollow`, {
                follower_id, following_id
            }, getConfig(token))
              article.user = response.data.following
              dispatch(setCurrentUser(response.data.follower))
            } catch (error) {
            console.log(error)
        }
    }

    const checkIfFollowingUser = () => (
        article?.user?.followers?.findIndex(item => item.pivot.follower_id === user?.id) !== -1
        ? 
            <button className="border-0 bg-light text-success ms-1"
                onClick={() => unfollowUser(user?.id, article?.user?.id)}>
                Unfollow
            </button>
        :
            <button className="border-0 bg-light text-success ms-1"
                onClick={() => followUser(user?.id, article?.user?.id)}>
                Follow
            </button>
    )

    const showClapButton = () => (
        isLoggedIn ? 
            <button className="border-0 bg-light text-danger ms-1"
                onClick={() => addClap()}>
                <i className="bi bi-balloon-heart-fill"></i>
            </button>
        :
            <Link className="border-0 bg-light text-danger ms-1"
                to="/login">
                <i className="bi bi-balloon-heart-fill"></i>
            </Link>
    )

    const addClap = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/clap/${slug}/article`, getConfig(token))
              setArticle(response.data.data)
            } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='container'>
            {
                loading ? <div className="d-flex justify-content-center mt-3">
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
                <div className="my-5">
                    <div className="col-md-10 mx-auto mb-2">
                        <div className="card">
                            <div className="card-header bg-white d-flex flex-column justify-content-center align-items-center">
                                <h3 className="mt-2">
                                    { article?.title }
                                </h3>
                                <div className="p-3 d-flex align-items-center">
                                    <img src={article?.user?.image_path} 
                                        width={40}
                                        height={40}
                                        className='rounded-circle me-2'
                                        alt={article?.user?.name}
                                    />
                                    <span className="text-primary fw-bold">
                                        { article?.user?.name }
                                    </span>
                                    {
                                        isLoggedIn ? 
                                            article?.user?.id !== user?.id && checkIfFollowingUser()
                                        :
                                        <Link className="text-decoration-none btn border-0 bg-light text-success ms-1"
                                            to="/login">
                                                Follow
                                        </Link>
                                    }
                                    <span className="mx-2">
                                        |
                                    </span>
                                    <span className="text-muted">
                                        { article?.created_at }
                                    </span>
                                </div>
                                <div>
                                    {
                                        showClapButton()
                                    }
                                    <span className="mx-2 fw-bold">
                                        { article?.clapsCount }
                                    </span>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="col-md-8 mx-auto my-5">
                                    <img src={article?.image_path} 
                                        className='img-fluid rounded'
                                        alt={article?.title}
                                    />
                                </div>
                                <div>
                                    { Parser().parse(article?.body) }
                                </div>
                                <div className="p-3 d-flex flex-column 
                                    justify-content-start bg-light rounded">
                                    <img src={article?.user?.image_path} 
                                        width={80}
                                        height={80}
                                        className='rounded-circle me-2'
                                        alt={article?.user?.name}
                                    />
                                    <h4 className="text-primary fw-bold">
                                        { article?.user?.name }
                                    </h4>
                                    {
                                        article?.user?.bio && <p>
                                            { article?.user?.bio }
                                        </p>
                                    }
                                    {
                                        article?.user?.followers.length > 0 && <div className="text-muted">
                                            <i>
                                                { article?.user?.followers.length } {" "}
                                                { article?.user?.followers.length > 1 ? 'Followers' : 'Follower' }
                                            </i>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="card-footer bg-white d-flex justify-content-between align-items-center">
                                <div className="d-flex flex-wrap">
                                    {
                                        article?.tags.map(tag => (
                                            <span key={tag.id} className="badge bg-secondary me-1">
                                                { tag.name }
                                            </span>
                                        )) 
                                    }
                                </div>
                                <div>
                                    {
                                        isLoggedIn ?
                                            <button className={`btn btn-sm btn-${exists ? 'warning' : 'light'}`}
                                                onClick={() => dispatch(bookmark(article))}>
                                                <i className="bi bi-bookmark-plus"></i>
                                            </button>
                                        :
                                            <Link className='btn btn-sm btn-light' to="/login">
                                                <i className="bi bi-bookmark-plus"></i>
                                            </Link>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
