import React, {Component} from 'react';

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      prevUser: '',
    }
  }

  signInWithPopup = () => {

  }

  signOut = () => {
    fetch(`/logout`)
      .then(() => this.props.setUser({id: 0}))
      .catch(err => console.log(err))
  }

  signUp = () => {

  }

  componentDidMount = () => {
    this.catchUser()
  }

  catchUser = () => {
    if(this.state.prevUser !== ''){
    fetch(`/api/users/${this.state.prevUser}`)
      .then((res) => res.json())
      .then((response) => console.log(response))/*this.setUser(response))
      .then(() => this.setState({userName: ''}))*/
       .catch(err => console.log(err))
    }
  }

  expireUser = () => {
    this.setState({prevUser: this.state.userName})
  }

  handleUserNameChange = (e) => {
    const target = e.target.value;
    this.setState({userName: target})
  }

  handleDisplayName = () => {
    if (this.props.currentUser && !this.props.currentUser.username) {
      return <span>Guest</span>
    } else {
      return <span>{this.props.currentUser.username}</span>
   }
  }

  handleSignButton = () => {
    if (this.props.currentUser && !this.props.currentUser.username) {
      return <div><form action="/login" method="post">
    <div>
        <label>Username:</label>
        <input type="text" value={this.state.userName} name="username" onChange={(e) => {this.handleUserNameChange(e)}}/>
    </div>
    <div>
        <label>Password:</label>
        <input type="password" name="password"/>
    </div>
    <div>
        <input type="submit" value="Log In"/>
    </div>
  </form>
  <form action="/api/users/create" method="post">
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
    } else {
      return <p className="sign-out-button" onClick={this.signOut}>Sign Out</p>
    }
  }

  render () {
    return (
      <section className="user-component">
        <p>{this.handleDisplayName()}</p>
        <span className="button-span">
          {this.handleSignButton()}
        </span>
      </section>
    )
  }
}

export default User;

