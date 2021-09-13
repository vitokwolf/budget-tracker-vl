let db
const request = indexedDB.open('budget', 1)

//in the event of database version changes
request.onupgradeneeded = (e) => {
  const db = e.target.result
  db.createObjectStore('pending', { autoIncrement: true })
}

//upon a successful creation
request.onsuccess = (e) => {
  db = e.target.result
  //   check if online, and if true, update database
  if (navigator.onLine) {
    offlineData()
  }
}

// error handling
request.onerror = (e) => console.log(e.target.errorCode)

// function to store data when offline
const saveRecord = (record) => {
  const transaction = db.transaction(['pending'], 'readwrite')
  const store = transaction.objectStore('pending')
  store.add(record)
}

const offlineData = () => {
  const transaction = db.transaction(['pending'], 'readwrite')
  const store = transaction.objectStore('pending')
  const allRecords = store.getAll()

  allRecords.onsuccess = () => {
    // if any data stored in indexDB, update database
    if (allRecords.result.length > 0) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(allRecords.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((serverResponse) => {
          if (serverResponse.message) {
            throw new Error(serverResponse)
          }
          //open one more transaction
          const transaction = db.transaction(['pending'], 'readwrite')

          //access the pending object store
          const store = transaction.objectStore('pending')

          //clear all items in store
          store.clear()

          alert('All pending transactions have been submitted!')
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
}

window.addEventListener('online', offlineData)
