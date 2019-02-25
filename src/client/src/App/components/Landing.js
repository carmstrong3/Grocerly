import React, {Component} from 'react';





class Landing extends Component {

  componentDidMount(){
    this.props.getCurrentUserOnMount();
  }

  render () {
    return(
      <section className='feature-list-container'>
        <h1>Welcome to Grocerly</h1>
        <ul className='feature-list'>
          <li>Add your own lists</li>
          <li>Track your items</li>
        </ul>
      </section>
  )
  }
}

export default Landing;

