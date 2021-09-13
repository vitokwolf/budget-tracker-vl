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
  if (navigator.online) {
    uploadPending()
  }
}
