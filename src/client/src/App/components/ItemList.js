import React, {Component} from 'react';

class ItemList extends Component {
  constructor(props) {
    super(props);
      this.state = {
      items: [],
      newItemName: '',

     };
  }

  componentDidMount() {
    this.getItemsOnMount();
  }

  getItemsOnMount = () => {
    fetch("/api/items")
      .then(res => res.json())
      .then(result => this.setState({ items: result }))
      .catch((err) => console.log(err))
  }

  createItem = (e) => {
    e.preventDefault();
    fetch(`/api/lists/${this.props.activeList.id}/items/create/${this.state.newItemName}`)
      .then(() => this.getItemsOnMount())
      .then(() => this.setState({newItemName: ''}))
      .catch((err) => console.log(err));
  }

  handleItemNameChange = (e) => {
    const target = e.target.value;
    this.setState({newItemName: target});
  }

  handlePurchasedDisplay = (purchased) => {
    if(purchased === true){
      return <p>yes</p>
    } else {
      return <p>no</p>
    }
  }

  deleteItem = (activeItem) => {
    const itemId = this.props.activeItem.id;
    const listId = this.props.activeItem.listId
    fetch(`/api/lists/${listId}/items/${itemId}/destroy`)
      .then(() => this.getItemsOnMount())
      .then(() => this.props.resetActiveItem())
      .catch((err) => console.log(err))
  }

  togglePurchased = (activeItem) => {
    if(activeItem.purchased === true){
      fetch(`/api/lists/${activeItem.listId}/items/${activeItem.id}/cancel`)
        .then(() => this.getItemsOnMount())
        .then(() => this.props.resetActiveItem())
        .catch((err) => console.log(err))
    } else {
      fetch(`/api/lists/${activeItem.listId}/items/${activeItem.id}/purchase`)
        .then(() => this.getItemsOnMount())
        .then(() => this.props.resetActiveItem())
        .catch((err) => console.log(err))
    }
  }
  togglePurchasedDisplay = () => {
    if(this.props.activeItem && this.props.activeItem.purchased === true) {
      return <button onClick={() => {this.togglePurchased(this.props.activeItem)}}>Set to unpurchased</button>
    } else {
      return <button onClick={() => {this.togglePurchased(this.props.activeItem)}}>Set to purchased</button>
    }
  }
  render() {
    return(
      <section className="item-list">
        <section>
          <table>
           <tbody>
            {this.state.items.filter(item =>
              item.listId === this.props.activeList.id).map((item, index) =>
                <tr key={index} onClick={() => this.props.setActiveItem(item)}>
                  <td>{item.name}</td>
                  <td>{this.handlePurchasedDisplay(item.purchased)}</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </section>
      <section>
        <form className="new-item-form" onSubmit={(e) => this.createItem(e)}>
          <label>Enter new item name:</label>
          <input type="text" value={this.state.newItemName} onChange={(e) => this.handleItemNameChange(e)}/>
          <input type="submit"/>
        </form>
      </section>
      <section>
       {this.togglePurchasedDisplay()}
        <button onClick={() => {this.deleteItem(this.props.activeItem)}}>Delete Active Item</button>
      </section>
    </section>
    )
  }
}

export default ItemList;

