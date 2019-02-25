import React, {Component} from 'react';
import {Link} from 'react-router-dom';

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

  logIn = () => {
    fetch('/api/login')
      .catch(err => console.log(err))
  }

  signOut = () => {
    this.props.resetUser()
  }

  signUp = () => {
    fetch('/api/signup')
      .catch(err => console.log(err))
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
    if (this.props.currentUser) {
      return <span>{this.props.currentUser}</span>
    } else {
      return <span>Guest</span>
   }
  }

    /* returnUser = (form) => {
    fetch(`/api/login`, {form})
      .then(res => console.log(res.json()))
      .catch((err) => console.log(err))
  } */

  handleSignButton = () => {
    if (this.props.currentUser === "Guest") {
      return <div className="log-sign-container">
        <Link to="/login" class="active">
          <button className="log-in-button">Log In</button>
        </Link>
        <Link to="/signup" class="active">
          <button className="sign-up-button">Sign Up</button>
        </Link>
      </div>
    } else {
      return <div className="sign-out-container">
        <Link to="/logout">
          <button className="sign-out-button" onClick={this.signOut}>Sign Out</button>
        </Link>
      </div>
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

