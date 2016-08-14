const dbver = 14
const dbname = 'pergle'
var db

function checkForIndex(txn, tableName, indexName, keyPath, isUnique) {
  const store = txn.objectStore(tableName)
  if(store.indexNames.length > 0) return
  const options = isUnique ? { unique: true } : {}
  store.createIndex(indexName, keyPath, options)
}

function checkQuestionTable(db) {
   const tableName = 'questions'
   if(db.objectStoreNames.contains(tableName)) return 
   const store = db.createObjectStore(tableName, { keyPath: 'id' })
   store.createIndex('text', 'text', { unique: true })
 }
function checkAnswerTable(db) {
   const tableName = 'answers'
   if(db.objectStoreNames.contains(tableName)) return
   const store = db.createObjectStore(tableName, { keyPath: 'id' })
   store.createIndex('text', 'text', { unique: true })
 }

function checkXrefsTable(db) {
    const tableName = 'xrefs'
    if(db.objectStoreNames.contains(tableName)) return 
    const store = db.createObjectStore(tableName)
    store.createIndex('qid', 'qid', { unique: false })
    store.createIndex('aid', 'aid', { unique: false })
 }

export function openIt(callback) {

  const openRequest = window.indexedDB.open(dbname, dbver)

  openRequest.onupgradeneeded = e => {
    var db = e.target.result
    var txn = e.target.transaction

    checkQuestionTable(db)
    checkAnswerTable(db)
    checkXrefsTable(db)
    
    checkForIndex(txn, 'questions', 'text', 'text', true)
    checkForIndex(txn, 'answers', 'text', 'text', true)
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

function saveAnswerOnly(answer, callback) {
  const transaction = db.transaction(['answers'], 'readwrite')
  var answers = transaction.objectStore('answers') 

  console.log('answers.indexes are ', answers.indexNames)

  //       answerStore.createIndex('answers', 'text', { unique: true })



  var addreq = answers.add({id:'03', text:answer});
  addreq.onerror = e => console.log('saveAnswer failed: ', e)
  addreq.onsuccess = e => {
    console.log('the answer was saved')
    callback()
  }
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
export const getAllXrefs = callback => getAll('xrefs', callback) 

export function saveAnswer(question, answer, callback) {
  // console.log('answers.indexes are ', db.transaction(['answers'], 'readonly').indexNames)

  const transaction = db.transaction(['questions'], 'readonly')
  var questions = transaction.objectStore('questions');

  console.log('questions.indexes are ', questions.indexNames)
  //       answerStore.createIndex('answers', 'text', { unique: true })
  // var questionsIndex = questions.index('text')
  // var request = questionsIndex.get(question);
  // // var answerIndex = answers.index('text') 
  // request.onerror = e => console.log('saveAnswer failed: ', e)
  // request.onsuccess = e => {
  //   var result = e.target.result
  //   if(!result) {
  //     console.log('not saving new questions here yet')
  //     return
  //   }
  //   saveAnswerOnly(answer, callback)
  // }
}

export function updateAnswer(aid, text, callback) {
  console.log('not implemented yet')
  // var transaction = db.transaction(['answers'],'readwrite');
  // var store = transaction.objectStore('answers');
  // var request = store.put({id:aid, text}, aid)
  // request.onerror = e => console.log('dammit - update did not take'); 
  // request.onsuccess = e => callback(e.target.result)
}

export function readQuestion(text, callback) {
  var transaction = db.transaction(['questions'],'readonly');
  var store = transaction.objectStore('questions');
  var index = store.index('text')
  var request = index.get(text);
  request.onerror = e => console.log('dammit'); 
  request.onsuccess = e => callback(e.target.result)
}
