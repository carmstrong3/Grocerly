import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import User from './components/User';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Signup from './components/Signup';
import Cookies from 'js-cookie';
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);
      this.state = {
      currentUser: "Guest"
      }
  }


  componentDidMount() {
    this.getCurrentUserOnMount();
  }

  getCurrentUserOnMount = () => {
    if(Cookies.get('connect.sid')){
      fetch('/api/getUser')
      .then(res => res.json())
        .then(user => this.setState({currentUser: user.username}))
        .catch(err => console.log(err));
    } else {
      console.log("no user yet")
    }
  }

  setUser = (user) => {
    this.setState({currentUser: user});
  }

  resetUser = () => {
    this.setState({currentUser: "Guest"})
    fetch('/logout')
      .catch(err => console.log(err));
  }

  toggleMenuBar = (e) => {
  }

  clickMenuBar = (e) => {
  }

  showWelcome = () => {
    if(this.state.currentUser === "Guest"){
      return <section className='feature-list-container'>
            <h1>Welcome to Grocerly</h1>
          </section>
    } else {
      return <section className="welcome-user">
              <h3>Hello {this.state.currentUser}</h3>
            </section>
    }
  }

  render() {
    return (
      <div className="App">
        <header>
          <div className="menu-container" onHover={(e) => this.toggleMenuBar(e)}> 
           <div className="menu-bars"></div>
           <div className="menu-bars"></div>
           <div className="menu-bars-3"></div>
          </div>
          <a className="title" href="/">Grocerly!</a>
          <User resetUser={this.resetUser} setUser={this.setUser} currentUser={this.state.currentUser}/>
        </header>
        <main id='main'>
          {this.showWelcome()}
          <Route path="/login" component={Login}/>
          <Route path="/dashboard" component={Dashboard}/>
          <Route path="/signup" component={Signup}/>
        </main>
        <footer>
          <p className="created-by">Created by: Clifford Armstrong III</p>
          <p className="contact-email">clifford.armstrong.3@gmail.com</p>
      </footer>
      </div>
    );
  }
}

export default App;

