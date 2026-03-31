import React, { useContext } from 'react'
import {AuthContext} from "../../context/authContext.jsx"

const Home = () => {
  const {user,loading} = useContext(AuthContext)
  if(loading) return <h2>Loading...</h2>
  return (
    <div>
      <h1>Home</h1>
      {user ? (
        <h2>Welcome, {user.name}</h2>
      ) : (
        <h2>Not logged in</h2>
      )}
    </div>
  )
}

export default Home
