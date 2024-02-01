import axios from 'axios'
import React, { useState } from 'react'
import { BASE_URL } from '../../helpers/config'
import { Link } from 'react-router-dom'

export default function SearchBox() {
    const [searchTerm, setSearTerm] = useState('')
    const [message, setMessage] = useState('')
    const [articles, setArticles] = useState([])
    const [loading, setLaoding] = useState(false)

    const searchArticles = async (e) => {
        e.preventDefault()
        setArticles([])
        setMessage('')
        setLaoding(true)

        const data = { searchTerm }

        try {
            const response = await axios.post(`${BASE_URL}/find/articles`,
              data)
                if (response.data.data.length) {
                    setArticles(response.data.data)
                }else {
                    setMessage('No results found.')
                }
                setLaoding(false)
                setSearTerm('')
            } catch (error) {
                setLaoding(false)
                setSearTerm('')
                console.log(error)
        }
    }

    return (
        <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvasExampleLabel">Search</h5>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
                <form onSubmit={(e) => searchArticles(e)}>
                    <div className="row align-items-center">
                        <div className="col-md-10">
                            <input type="search" name="searchTerm"
                                value={searchTerm}
                                onChange={(e) => setSearTerm(e.target.value)}
                                className="form-control" 
                                placeholder='Search...'
                            />
                        </div>
                        <div className="col-md-2">
                            <button type='submit' className="btn btn-sm btn-dark">
                                <i className="bi bi-search"></i>
                            </button>
                        </div>
                    </div>
                </form>
                {
                    message && <div className="alert alert-info my-3">
                        { message }
                    </div>
                }
                <ul className="list-group my-3">
                    {
                        loading ? 
                            <div className="my-3">
                                <span className="text-muted">
                                    <i>Searching...</i>
                                </span>
                            </div>
                        :
                        articles?.map(article => (
                            <li key={article.id} className="list-group-item">
                                <div className="d-flex justify-content-between align-items-center">
                                    <img src={article.image_path} 
                                        className='rounded me-3'
                                        width={60}
                                        height={60}
                                        alt={article.title}
                                    />
                                    <span>
                                        { article.title }
                                    </span>
                                    <Link to={`/articles/${article.slug}`}
                                        className='text-decoration-none text-primary'>
                                        View
                                    </Link>
                                </div>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    )
}
