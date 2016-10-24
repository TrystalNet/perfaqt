export function openIDB(callback) {
  const req = window.indexedDB.open('perfaqt', 17)
  req.onsuccess = event => callback(event.target.result)
  req.onupgradeneeded = function(e) {
    const idb = e.target.result
    if(idb.objectStoreNames.contains('scores')) idb.deleteObjectStore('scores')
    if(idb.objectStoreNames.contains('answers')) idb.deleteObjectStore('answers')
    if(idb.objectStoreNames.contains('questions')) idb.deleteObjectStore('questions')
    if(!idb.objectStoreNames.contains('searches')) idb.createObjectStore('searches', {keyPath:'text'})
    callback(idb)
  }
}