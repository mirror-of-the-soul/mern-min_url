import React, {useContext} from 'react'
import {NavLink, useHistory} from 'react-router-dom'
import {AuthContext} from '../context/AuthContext';

export const Navbar = () => {
  const history = useHistory()
  const auth = useContext(AuthContext)
  const logoutHandler = event => {
    event.preventDefault()
    auth.logout()
    history.push('/')
  }

  return (
    <nav>
      <div className="nav-wrapper #d500f9 purple accent-3" style={{ padding:'0 2rem'}}>
        <span href="/" className="brand-logo">Сокращение ссылок</span>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          <li><NavLink to = "/create">Создать</NavLink></li>
          <li><NavLink to = "/links">Ссылки</NavLink></li>
          <li><a href="/" onClick={logoutHandler}>Выход</a></li>
        </ul>
      </div>
    </nav>
  )
}