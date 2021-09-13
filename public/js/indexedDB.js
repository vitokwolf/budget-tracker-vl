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
    uploadPending()
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
