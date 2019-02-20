import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class Home extends Component {
  render() {
  const loggedIn = (user) => {
    if(user){
      return <h2>User is here</h2>
    } else {
      return <h2>User is not here</h2>
    }
  }

    return (
    <div className="App">
      <h1>Project Home</h1>
      {/* Link to List.js */}
      <Link to={'./list'}>
        <button variant="raised">
            My List
        </button>
      </Link>
    <form action="/login" method="post">
    <div>
        <label>Username:</label>
        <input type="text" name="username"/>
    </div>
    <div>
        <label>Password:</label>
        <input type="password" name="password"/>
    </div>
    <div>
        <input type="submit" value="Log In"/>
    </div>
  </form>
  </div>
    );
  }
}
export default Home;
