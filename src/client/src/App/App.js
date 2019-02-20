import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import ListList from './components/ListList';
import ItemList from './components/ItemList';
import User from './components/User';
import Landing from './components/Landing';
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);
      this.state = {
      activeList: {},
      currentUser: currentUser || {},
      activeItem: {}
      }
  }

  setActiveList = (list) => {
    this.setState({activeList: list});
  }

  setUser = (user) => {
    this.setState({currentUser: user});
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
          {this.state.currentUser && this.state.currentUser.username}
          <User setUser={this.setUser} currentUser={this.state.currentUser}/>
        </header>
        <main id='main'>
          <Route exact path="/" component={Landing} />
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

