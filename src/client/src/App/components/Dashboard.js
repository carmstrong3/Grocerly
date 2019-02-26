import React, {Component} from 'react';
import ListList from './ListList';
import ItemList from './ItemList';

class Dashboard extends Component {
  constructor(props){
    super(props);
    this.state = {
      currentUser: "Guest",
      activeList: {},
      activeItem: {}
    }
  }

  componentDidMount() {
    this.getCurrentUserOnMount();
  }

  getCurrentUserOnMount = () => {
    fetch('/api/getUser')
      .then(res => res.json())
      .then(user => this.setState({currentUser: user.username}))
        .catch(err => console.log(err));
  }

  handleClick = (e) => {
    this.getCurrentUserOnMount();
  }

  setActiveList = (list) => {
    this.setState({activeList: list});
  }

  resetActiveList = () => {
    this.setState({activeList: {}});
  }

  resetActiveItem = () => {
    this.setState({activeItem: {}});
  }

  setActiveItem = (item) => {
    this.setState({activeItem: item});
  }

  render(){
    return(
      <div className="dashboard">
        {/* <div>
          <button type="button" onClick={(e) => this.handleClick(e)}>get user</button>
        </div> */}
        <div className="list-container">
          <ListList activeList={this.state.activeList} setActiveList={this.setActiveList} resetActiveList={this.resetActiveList} currentUser={this.state.currentUser}/>
        </div>
          <div id='content'>
            <ItemList activeItem={this.state.activeItem} resetActiveItem={this.resetActiveItem} setActiveItem={this.setActiveItem} activeList={this.state.activeList} currentUser={this.state.currentUser}/>
          </div>
      </div>
    )
  }
}

export default Dashboard;
