import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import ListList from './components/ListList';
import ItemList from './components/ItemList';
import User from './components/User';
import Landing from './components/Landing';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Signup from './components/Signup';
import Cookies from 'js-cookie';
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);
      this.state = {
      activeList: {},
      currentUser: "Guest",
      activeItem: {}
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

  setActiveList = (list) => {
    this.setState({activeList: list});
  }

  setUser = (user) => {
    this.setState({currentUser: user});
  }

  resetUser = () => {
    this.setState({currentUser: "Guest"});
  }

  resetActiveList = () => {
    this.setState({activeList: {}});
  }

  toggleMenuBar = (e) => {
  }

  clickMenuBar = (e) => {
  }

  resetActiveItem = () => {
    this.setState({activeItem: {}});
  }

  setActiveItem = (item) => {
    this.setState({activeItem: item});
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
          <section className='feature-list-container'>
            <h1>Welcome to Grocerly</h1>
              <ul className='feature-list'>
              <li>Add your own lists</li>
              <li>Track your items</li>
            </ul>
          </section>
          <Route path="/login" component={Login}/>
          <Route path="/dashboard" component={Dashboard}/>
          <Route path="/signup" component={Signup}/>
          <ListList activeList={this.state.activeList} setActiveList={this.setActiveList} resetActiveList={this.resetActiveList}/>
          <div id='content'>
            <ItemList activeItem={this.state.activeItem} resetActiveItem={this.resetActiveItem} setActiveItem={this.setActiveItem} activeList={this.state.activeList} currentUser={this.state.currentUser}/>
          </div>
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

