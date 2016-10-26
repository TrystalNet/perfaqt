export function openIDB(callback) {

  const req = window.indexedDB.open('perfaqt', 17)


  req.onsuccess = event => callback(event.target.result)
  req.onupgradeneeded = function(event) {
    console.log('fuck you asshole!')


    const db = event.target.result
    if(db.objectStoreNames.contains('scores')) db.deleteObjectStore('scores')
    if(db.objectStoreNames.contains('answers')) db.deleteObjectStore('answers')
    if(db.objectStoreNames.contains('questions')) db.deleteObjectStore('questions')
    if(!db.objectStoreNames.contains('searches')) db.createObjectStore('searches', {keyPath:'text'})


    const transaction = event.target.transaction
    console.log('what the f*****')
    transaction.oncomplete = e => callback(db)
    console.log('jesus h ch***') 
  }
}