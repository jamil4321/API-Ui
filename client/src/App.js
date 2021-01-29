import React, { Component } from 'react'
import { v1 as uuid } from 'uuid'
class App extends Component {
  state = {
    inputItem: '',
    items: [],
    url: 'https://apiandui.herokuapp.com'
  }
  componentDidMount() {
    let func = async () => {
      let get = await this.getItems()
      this.setState({ items: get })
    }
    func()
  }
  getItems = async () => {
    const promise = await fetch(`${this.state.url}/getItems`, {
      method: 'GET',
    }).then(res => res.json()).then(data => data).catch(err => err)
    return await promise
  }
  addItem = async () => {
    let flag = true
    let newItem = {
      id: uuid(),
      item: this.state.inputItem,
      isEdit: false
    }
    let promise = await fetch(`${this.state.url}/addItem`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(newItem)
    }).then(res => res.json()).then(data => data).catch(err => { flag = false })
    if (flag) {
      this.setState({ items: [...this.state.items, promise[0]] })
    } else {
      alert('Unable to Insert ')
    }
    this.setState({ inputItem: '' })
  }
  onEditPress = (index) => {
    console.log('press')
    let editItem = this.state.items;
    editItem[index].isEdit = true;
    this.setState({ items: editItem });
  }
  EditChange = (e, index) => {
    console.log('press')
    let editItemChange = this.state.items;
    editItemChange[index].item = e.target.value;
    this.setState({ items: editItemChange })
    console.log(e.target.value)
  }
  onEditSave = async (index) => {
    console.log('press')
    let editItemSave = this.state.items;
    editItemSave[index].isEdit = false;
    this.setState({ items: editItemSave })
    let promise = await fetch(`${this.state.url}/updateItem`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(this.state.items[index])
    }).then(res => res.json()).then(data => data).catch(err => console.log(err))
  }
  onDeletClick = async (index) => {
    console.log('press')
    let promise = await fetch(`${this.state.url}/remove`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(this.state.items[index])
    }).then(res => res.json()).then(data => data).catch(err => console.log(err))
    console.log(index, this.state.items)
    var removeItm = this.state.items;
    removeItm.splice(index, 1);
    this.setState({ items: removeItm });
    console.log(this.state.item)
  }
  render() {
    return (
      <div>
        <div>
          <h1>Enter Your Task</h1>
          <input type="text" value={this.state.inputItem} onChange={(e) => this.setState({ inputItem: e.target.value })} />
          <button onClick={this.addItem}>
            submit
        </button>
        </div>
        <div>
          <h1>Your Task</h1>
          <div>
            <ul>
              {this.state.items.map((data, i) => {
                return (
                  <li key={data + i}>{data.isEdit ? <>
                    <input value={data.item} onChange={(e) => this.EditChange(e, i)} /> <button onClick={() => this.onEditSave(i)}>save</button></> :
                    <>{data.item}<button onClick={() => this.onDeletClick(i)}>Delete</button><button onClick={() => this.onEditPress(i)}>Edit</button></>}</li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}
export default App