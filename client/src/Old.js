import React from 'react'
import { v1 as uuid } from 'uuid'
import './App.css'

const App = () => {
  const [items, setItems] = React.useState([])
  const [inputItem, setInputItems] = React.useState('')
  React.useEffect(() => {
    let func = async () => {
      let get = await getItems()
      setItems(get)
    }
    func()
  }, [])


  const url = 'http://localhost:2000'
  const getItems = async () => {
    const promise = await fetch(`${url}/getItems`, {
      method: 'GET',
    }).then(res => res.json()).then(data => data).catch(err => err)
    return await promise
  }
  const addItem = async () => {
    let flag = true
    let newItem = {
      id: uuid(),
      item: inputItem,
      isEdit: false
    }
    let promise = await fetch(`${url}/addItem`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(newItem)
    }).then(res => res.json()).then(data => data).catch(err => { flag = false })
    if (flag) {
      setItems([...items, promise[0]])
    } else {
      alert('Unable to Insert ')
    }
    setInputItems('')
  }
  const onEditPress = (index) => {
    console.log('press')
    let editItem = items;
    editItem[index].isEdit = true;
    setItems(editItem);
  }
  const EditChange = (e, index) => {
    console.log('press')
    let editItemChange = items;
    editItemChange[index].name = e.target.value;
    setItems(editItemChange)
  }
  const onEditSave = (index) => {
    console.log('press')
    let editItemSave = items;
    editItemSave[index].isEdit = false;
    setItems(editItemSave)
  }
  const onDeletClick = async (index) => {
    console.log('press')
    let promise = await fetch(`${url}/remove`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(items[index])
    }).then(res => res.json()).then(data => data).catch(err => console.log(err))
    let get = await getItems()
    setItems(get)
  }
  return (
    <div>
      <div>
        <h1>Enter Your Task</h1>
        <input type="text" value={inputItem} onChange={(e) => setInputItems(e.target.value)} />
        <button onClick={addItem}>
          submit
        </button>
      </div>
      <div>
        <h1>Your Task</h1>
        <div>
          <ul>
            {items.map((data, i) => {
              return (
                <li key={data + i}>{data.isEdit ? <>
                  <input value={data.item} onChange={(e) => EditChange(e, i)} /> <button onClick={() => onEditSave(i)}>save</button></> :
                  <>{data.item}<button onClick={() => onDeletClick(i)}>Delete</button><button onClick={() => onEditPress(i)}>Edit</button></>}</li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App
