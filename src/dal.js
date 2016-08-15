const dbver = 15
const dbname = 'perfaqt'
var db

function checkTable(db, tableName) {
   if(db.objectStoreNames.contains(tableName)) return 
   db.createObjectStore(tableName, { keyPath: 'id' })
}

export function openIt(callback) {
  const openRequest = window.indexedDB.open(dbname, dbver)
  openRequest.onupgradeneeded = e => {
    var db = e.target.result
    var txn = e.target.transaction
    checkTable(db, 'questions')
    checkTable(db, 'answers')
    checkTable(db, 'scores')
  }
  openRequest.onsuccess = e => {
    db = e.target.result
    if(callback) callback()
  }
  openRequest.onerror = e => {
    console.log('we got an error from indexedDB', e.target.errorCode)
  }
}

// In the following line, you should include the prefixes of implementations you want to test.
if(!window.indexedDB) window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
// DON'T use 'var indexedDB = ...' if you're not in a function.
// Moreover, you may need references to some window.IDB* objects:
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: 'readwrite'}; // This line should only be needed if it is needed to support the object's constants for older browsers
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
// (Mozilla has never prefixed these objects, so we don't need window.mozIDB*)

if (!window.indexedDB) {
    window.alert('Your browser doesn\'t support a stable version of IndexedDB. Such and such feature will not be available.')
}

function getAll(TABLE, callback) {
  var transaction = db.transaction([TABLE],'readonly');
  var store = transaction.objectStore(TABLE);
  var result = [];
  store.openCursor().onsuccess = function(event) {
    var cursor = event.target.result;
    if(cursor) {
      result.push(cursor.value)
      cursor.continue()
    }
    else callback(result)
  }
}

export const getAllAnswers = callback => getAll('answers', callback) 
export const getAllQuestions = callback => getAll('questions', callback) 
export const getAllScores = callback => getAll('scores', callback) 

function add(tablename, jsonObject) {
  return new Promise((resolve, reject) => {
    var transaction = db.transaction([tablename],'readwrite');
    var store = transaction.objectStore(tablename);
    var request = store.add(jsonObject)
    request.onerror = e => reject(e) 
    request.onsuccess = e => resolve(e.target.result)
  })
}

export const addScore    = bo => add('scores', bo)
export const addQuestion = bo => add('questions', bo)
export const addAnswer   = bo => add('answers', bo)

function put(tablename, jsonObject) {
  return new Promise((resolve, reject) => {
    var transaction = db.transaction([tablename],'readwrite');
    var store = transaction.objectStore(tablename);
    var request = store.put(jsonObject)
    request.onerror = e => reject(e) 
    request.onsuccess = e => resolve(e.target.result)
  })
}

export const putScore    = bo => put('scores', bo)
export const putQuestion = bo => put('questions', bo)
export const putAnswer   = bo => put('answers', bo)

export function readQuestion(text) {
  return new Promise((resolve, reject) => {
    var transaction = db.transaction(['questions'],'readonly');
    var store = transaction.objectStore('questions');
    var index = store.index('text')
    var request = index.get(text);
    request.onerror = e => reject(e)
    request.onsuccess = e => resolve(e.target.result)
  }) 
}
