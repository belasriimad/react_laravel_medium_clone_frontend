import React, { useEffect, useState } from 'react'
import { BASE_URL, getConfig } from '../helpers/config'
import axios from 'axios'
import ArticleList from './articles/ArticleList'
import Tags from './tags/Tags'
import Spinner from './layouts/Spinner'
import SwitchNav from './layouts/SwitchNav'
import { useSelector } from 'react-redux'
import useTitle from './custom/useTitle'

export default function Home() {
  const { token, isLoggedIn } = useSelector(state => state.user)
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [articleByTag, setArticleByTag] = useState('')
  const [articleByFollowing, setArticleByFollowing] = useState(false)
  const [meta, setMeta] = useState({
    to: 0,
    total: 0
  })

  //change page title
  useTitle('Home')

  useEffect(() => {
    const fetchArticles = async () => {
      setMessage('')
      setLoading(true)
      try {
        if (articleByTag) {
          const response = await axios.get(`${BASE_URL}/tag/${articleByTag}/articles`)
          if (response.data.data.length) {
            setArticles(response.data.data)
            setMeta(response.data.meta)
          }else {
            setMessage('No articles found')
          }
          setLoading(false)
        } else if (articleByFollowing) {
          const response = await axios.get(`${BASE_URL}/followings/articles`,
            getConfig(token))
          if (response.data.data.length) {
            setArticles(response.data.data)
            setMeta(response.data.meta)
          }else {
            setMessage('No articles found')
          }
          setLoading(false)
        } else {
          const response = await axios.get(`${BASE_URL}/articles`)
          setArticles(response.data.data)
          setMeta(response.data.meta)
          setLoading(false)
        }
      } catch (error) {
        setLoading(false)
        console.log(error)
      }
    }
    fetchArticles()
  }, [articleByTag, articleByFollowing])

  const fetchNextArticles = async () => {
    try {
      if (articleByTag) {
        const response = await axios.get(`${BASE_URL}/tag/${articleByTag}/articles?page=${meta.current_page += 1}`)
        setArticles(prevArticles => [...prevArticles, ...response.data.data])
        setMeta(response.data.meta)
      } else if (articleByFollowing) {
        const response = await axios.get(`${BASE_URL}/followings/articles?page=${meta.current_page += 1}`,
          getConfig(token))
        setArticles(prevArticles => [...prevArticles, ...response.data.data])
        setMeta(response.data.meta)
      } else {
        const response = await axios.get(`${BASE_URL}/articles?page=${meta.current_page += 1}`)
        setArticles(prevArticles => [...prevArticles, ...response.data.data])
        setMeta(response.data.meta)
      }
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  return (
    <div className="container">
      {
        loading ? 
          <div className="d-flex justify-content-center mt-5">
            <Spinner />
          </div>
        :
        <div className='row my-5'>
          {/* switching between all the articles and the articles
          of the users we follow  */}
          {
            isLoggedIn && <SwitchNav articleByFollowing={articleByFollowing}
              setArticleByFollowing={setArticleByFollowing}
              setArticleByTag={setArticleByTag} />
          }
          {/* display all the published articles */}
          {
            message ? 
              <div className="col-md-8">
                <div className="alert alert-info">
                  { message }
                </div>
              </div>
            :
            <ArticleList articles={articles} 
              fetchNextArticles={fetchNextArticles}
              meta={meta}  
            />
          }
          {/* display all the tags */}
          <Tags setArticleByTag={setArticleByTag}
            articleByTag={articleByTag}
            setArticleByFollowing={setArticleByFollowing} />
        </div>
      }
    </div>
  )
}
