import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

export default function Sidebar() {
    const { user } = useSelector(state => state.user)

    return (
        <div className='col-md-3'>
            <div className="card">
                <div className="card-body d-flex flex-column justify-content-center align-items-center">
                    <img src={user?.image_path} 
                        width={100}
                        height={100}
                        className='rounded-circle'
                        alt={user?.name}
                    />
                    <span className="fw-bold my-2">
                        {user?.name}
                    </span>
                    {
                        user?.bio && <p>
                            { user?.bio }
                        </p>
                    }
                    <span className="text-muted my-2">
                        <i>
                            { user?.followers.length } {" "}
                            { user?.followers.length > 1 ? 'Followers' : 'Follower' }
                        </i>
                    </span>
                    <span className="text-muted my-2">
                        <i>
                            { user?.followings.length } {" "}
                            Following
                        </i>
                    </span>
                    <Link className='btn btn-link' to="/update/profile"
                        >Update your profile</Link>
                    <Link className='btn btn-link' to="/update/password"
                        >Update your password</Link>
                </div>
            </div>
        </div>
    )
}
