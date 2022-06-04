import { useState } from 'react'
import TableView from '../components/TableView'
import { Search } from '../components'

const Test = () => {
  const [q, setQ] = useState('')
  const data = {
    data: [
      {
        _id: 1,
        name: 'John Doe',
        email: 'john@mail.com',
      },
      {
        _id: 2,
        name: 'Jane Doe',
        email: 'jane@mail.com',
      },
    ],
    total: 2,
  }

  const header = ['Name', 'Email']
  const body = ['name', 'email']
  const editHandler = (item) => console.log(item)
  const deleteHandler = (item) => console.log(item)

  const searchHandler = (e) => console.log('search handler')

  const isLoadingDelete = false

  const name = 'Users List'
  const label = 'User'
  const modal = '#user'
  const searchPlaceholder = 'Search by name'

  return (
    <div>
      <TableView
        data={data}
        header={header}
        body={body}
        editHandler={editHandler}
        deleteHandler={deleteHandler}
        searchHandler={searchHandler}
        Search={Search}
        isLoadingDelete={isLoadingDelete}
        name={name}
        label={label}
        modal={modal}
        setQ={setQ}
        q={q}
        searchPlaceholder={searchPlaceholder}
      />
    </div>
  )
}

export default Test
