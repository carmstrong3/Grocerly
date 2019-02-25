import React, { Component } from 'react';

class Signup extends Component {
  render(){
    return (
      <div>
        <h2>Signup For Grocerly</h2>
        <div>
          <form action="/api/signup" method="post">
            <div>
                <label>Username:</label>
                <input type="text" name="username"/>
            </div>
            <div>
                <label>Password:</label>
                <input type="password" name="password"/>
            </div>
            <div>
                <input type="submit" value="Sign Up"/>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default Signup;

