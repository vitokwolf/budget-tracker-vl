let db
const request = indexedDB.open('budget', 1)

//in the event of database version changes
request.onupgradeneeded = function (e) {
  const newDb = e.target.result
  newDb.createObjectStore('pending', { autoIncrement: true })
}

//upon a successful creation
request.onsuccess = function (e) {
  db = e.target.result
  //   check if online, and if true, update database
  if (navigator.online) {
    offlineData()
  }
}

// error handling
request.onerror = function (e) {
  console.log(e.target.errorCode)
}

// function to store data when offline
const saveRecord = function (record) {
  const transaction = db.transaction(['pending'], 'readwrite')
  const store = transaction.objectStore('pending')
  store.add(record)
}

const offlineData = function () {
  const transaction = db.transaction(['pending'], 'readwrite')
  const store = transaction.objectStore('pending')
  const allRecords = store.getAll()

  allRecords.onsuccess = async function () {
    // if any data stored in indexDB, update database
    if (allRecords.result.length > 0) {
      const post = await fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      })
      const json = await post.json()
      if (json.message) {
        throw new Error(json)
      }
      const transaction = db.transaction(['pending'], 'readwrite')
      const store = transaction.objectStore('pending')
      store.clear()
      alert('Offline activity has been uploaded to your database')
    }
  }
}

window.addEventListener('online', offlineData)
