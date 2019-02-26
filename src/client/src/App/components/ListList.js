import React, {Component} from 'react';

class ListList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lists: [],
      newListName: '',
    };
  }

  componentDidMount() {
    this.getListsOnMount();
  }

  getListsOnMount = () => {
    fetch("/api/lists/")
      .then(res => res.json())
      .then(result => this.setState({ lists: result }))
      .catch(err => console.log(err))
  }

  createList(event) {
    event.preventDefault();
    fetch(`/api/lists/create/${this.state.newListName}`)
      .then(() => this.getListsOnMount())
      .then(() => this.setState({newListName: ''}))
      .catch(err => console.log(err));
    /* Optimal way but not working at all for some reason
     * fetch('/api/lists/create', {
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: {
        "name": this.state.newListName
      }
    });
    */
  }

  handleListChange(event) {
    const target = event.target.value;
    this.setState({ newListName: target});
  }

  deleteList = (activeList) => {
    const id = activeList.id;
    fetch(`/api/lists/${id}/destroy`)
      .then(() => this.getListsOnMount())
      .catch(err => console.log(err))
  }

  handleActiveListDisplay = (listName) => {
    if(this.props.activeList.name === listName){
      return <b>{listName}</b>
    } else {
      return <p>{listName}</p>
    }
  }
  render() {
    return(
      <section className="list-list">
        <section id="new-delete-list">
          <form className="new-list-form" onSubmit={(e) => this.createList(e)}>
            <label>Enter new list name:</label>
              <input type="text" value={this.state.newListName} onChange={(e) => {this.handleListChange(e)}}/>
              <input type="submit"/>
          </form>
          <button onClick={() => {this.deleteList(this.props.activeList)}}>Delete Active List</button>
      </section>
        <section>
          <table className="list-table">
            <colgroup>
              <col/>
            </colgroup>
            <tbody>
              {this.state.lists.map((list, index) =>
                <tr key={index} onClick={() => this.props.setActiveList(list)}>
                  <td>{this.handleActiveListDisplay(list.name)}</td>
                </tr>
                )
              }
            </tbody>
          </table>
        </section>
              </section>
    )
  }
}

export default ListList;

