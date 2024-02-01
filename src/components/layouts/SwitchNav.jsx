import React from 'react'

export default function SwitchNav({ articleByFollowing, setArticleByFollowing, setArticleByTag }) {
  return (
    <div className='row mt-3 mb-5'>
        <div className="col-md-6 mx-auto">
            <div className="d-flex justify-content-start">
                <button className={`btn btn-link text-decoration-none text-dark
                    ${!articleByFollowing ? 'border-bottom' : ''}`}
                    onClick={() => {
                        setArticleByTag('')
                        setArticleByFollowing(false)
                    }}>
                    For you
                </button>
                <button className={`btn btn-link text-decoration-none text-dark
                    ${articleByFollowing ? 'border-bottom' : ''}`}
                    onClick={() => {
                        setArticleByTag('')
                        setArticleByFollowing(true)
                    }}>
                    Following
                </button>
            </div>
        </div>
    </div>
  )
}
