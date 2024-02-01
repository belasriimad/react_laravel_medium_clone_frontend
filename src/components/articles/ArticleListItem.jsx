import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { bookmark } from '../../redux/slices/bookmarkSlice'

export default function ArticleListItem({article}) {
    const { isLoggedIn } = useSelector(state => state.user)
    const { bookmarked } = useSelector(state => state.bookmark)
    const exists = bookmarked.find(item => item.id === article?.id)
    const dispatch = useDispatch()

    return (
        <div className='card mb-2'>
            <div className="card-header bg-white d-flex justify-content-start">
                <div className="p-3 d-flex align-items-center">
                    <img src={article.user.image_path} 
                        width={40}
                        height={40}
                        className='rounded-circle me-2'
                        alt={article.user.name}
                    />
                    <span className="text-primary fw-bold">
                        { article.user.name }
                    </span>
                    <span className="mx-2">
                    |
                    </span>
                    <span className="text-muted">
                        { article.created_at }
                    </span>
                </div>
            </div>
            <div className="card-body d-flex justify-content-between">
                <div className="d-flex flex-column p-2">
                    <Link to={`/articles/${article.slug}`}
                        className='text-decoration-none text-dark'>
                        <h4>
                            { article.title }
                        </h4>
                    </Link>
                    <p>
                        { article.excerpt }
                    </p>
                </div>
                <div>
                    <img src={article.image_path} 
                        width={150}
                        height={150}
                        className='rounded'
                        alt={article.title}
                    />
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
    )
}
