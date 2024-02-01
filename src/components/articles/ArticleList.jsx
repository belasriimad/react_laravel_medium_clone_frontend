import React, { useEffect } from 'react'
import ArticleListItem from './ArticleListItem'

export default function ArticleList({articles, fetchNextArticles, meta}) {

    useEffect(() => {
        //define the scroll
        const scroll = () => {
            const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight
            if (bottom) {
                if (meta.to < meta.total) {
                    fetchNextArticles()
                }
            }

        }
        //add the scroll event once the component is mounted
        window.addEventListener('scroll', scroll)
        //remove the event once the component unmount
        return () => {
            window.removeEventListener('scroll', scroll)
        }
    }, [meta.to, meta.total])

    return (
        <div className='col-md-8'>
            {
                articles?.length ? articles?.map(article => (
                    <ArticleListItem article={article}
                        key={article.id} />
                ))
                :
                <div className="alert alert-info">
                    No article found.
                </div>
            }
        </div>
    )
}
