import React, {Component} from 'react';

class Dashboard extends Component {
  constructor(props){
    super(props);
    this.state = {
      currentUser: "Guest"
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

  render(){
    return(
      <div>
        <h1>Hi {this.state.currentUser}, Welcome to your Dashboard</h1>
        <button type="button" onClick={(e) => this.handleClick(e)}>get user</button>
      </div>
    )
  }
}

export default Dashboard;
