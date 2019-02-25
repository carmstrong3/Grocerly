import React, { Component } from 'react';

class Login extends Component {
  render(){
    return (
      <div>
        <h2>Login to Grocerly</h2>
        <div>
          <form action="/api/login" method="post" id="userForm">
            <div>
                <label>username:</label>
                <input type="text" name="username"/>
            </div>
            <div>
                <label>password:</label>
                <input type="password" name="password"/>
            </div>
            <div>
                <input type="submit" value="log in"/>
            </div>
          </form>
        </div>

      </div>
    )
  }
}

export default Login;
