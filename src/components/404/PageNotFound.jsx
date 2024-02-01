import React from 'react'
import { Link } from 'react-router-dom'
import useTitle from '../custom/useTitle'

export default function PageNotFound() {

    //change page title
    useTitle('404 Page Not Found')

    return (
        <div className='container'>
            <div className="my-5 pb-5">
                <div className="col-md-6 mx-auto">
                    <div className="card text-center">
                        <div className="card-body">
                            <h3 className="my-3">
                                404 Page Not Found
                            </h3>
                            <Link to="/" className='btn btn-outline-secondary my-2'>
                                Back Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
