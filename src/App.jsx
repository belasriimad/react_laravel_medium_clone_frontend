import React from 'react'
import Home from './components/Home'
import Login from './components/user/Login'
import Register from './components/user/Register'
import Profile from './components/user/Profile'
import Header from './components/layouts/Header'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Write from './components/articles/Write'
import Article from './components/articles/Article'
import Bookmarked from './components/user/articles/Bookmarked'
import UpdateArticle from './components/user/articles/UpdateArticle'
import UpdateProfile from './components/user/UpdateProfile'
import UpdatePassword from './components/user/UpdatePassword'
import PageNotFound from './components/404/PageNotFound'

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/write" element={<Write />} />
        <Route path="/articles/:slug" element={<Article />} />
        <Route path="/update/profile" element={<UpdateProfile />} />
        <Route path="/update/password" element={<UpdatePassword />} />
        <Route path="/update/article/:slug" element={<UpdateArticle />} />
        <Route path="/bookmarked" element={<Bookmarked />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
