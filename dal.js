const PouchDB = require('pouchdb-http')
PouchDB.plugin(require('pouchdb-mapreduce'))
const couch_base_uri = "http://127.0.0.1:5984/" //set back to 5984 before commit
const couch_dbname = "pharma-student" //set back to pharma-student before commit
const db = new PouchDB(couch_base_uri + couch_dbname)
const {
    map,
    uniq,
    prop,
    omit,
    compose,
    drop
} = require('ramda')


/////////////////////
//   medications
/////////////////////

function getMed(medId, cb) {
    db.get(medId, function(err, doc) {
        if (err) return cb(err)
        cb(null, doc)
    })
}

function addMed(med, cb) {
    med.type = "medication"
    let newId = "medication_" + med.label.toLowerCase()
    med._id = prepID(newId)

    db.put(med, function(err, res) {
        if (err) return cb(err)
        cb(null, res)
    })
}

function updateMed(med, cb) {
    db.put(med, function(err, doc) {
        if (err) return cb(err)
        cb(null, doc)
    })
}

function deleteMed(id, cb) {
    db.get(id, function(err, doc) {
        if (err) return cb(err)

        db.remove(doc, function(err, deletedMed) {
            if (err) return cb(err)
            cb(null, deletedMed)
        })
    })
}

// listMedsByLabel() - alpha sort by label - call pouchdb's api: db.query('medsByLabel', {options}, cb)

function listMedsByLabel(startKey, limit, cb) {

  let options = {}
  options.include_docs = true

  if (startKey) {
    options.startkey = startKey
    options.limit = limit ? Number(limit) + 1 : 10
  }  else {
    options.limit = limit ? Number(limit) : 10
  }

  const meds =  startKey ? compose (drop(1),map(x=>x.doc),map(addSortToken)):compose (map(x=>x.doc),map(addSortToken))

    db.query('medsByLabel', options, function(err, res) {
      if (err) return cb(err)
      cb(null,meds(res.rows))
  })
}


function listMedsByIngredient(ingredient, cb) {
    db.query('medsByIngredient', {
        include_docs: true,
        keys: [ingredient]
    }, function(err, res) {
        if (err) return cb(err)
        cb(null, map(returnDoc, res.rows))
    })
}

function getUniqueIngredients(cb) {
    db.query('medsByIngredient', null, function(err, res) {
        if (err) return cb(err)
        cb(null, uniq(map(row => row.key, res.rows)))
    })
}


///////////////////////
// helper functions
///////////////////////

function prepID(id) {
  return id.replace(/ /g, "_")
}

var addSortToken = function(queryRow) {
    queryRow.doc.startKey = queryRow.key;
    return queryRow;
}

function checkRequiredInputs(doc) {
    return prop('storeNumber', doc) && prop('storeChainName', doc) && prop('storeName', doc) && prop('streetAddress', doc) && prop('phone', doc)
}

const returnDoc = row => row.doc


const dal = {
    listMedsByIngredient: listMedsByIngredient,
    getMed: getMed,
    addMed: addMed,
    updateMed: updateMed,
    deleteMed: deleteMed
}

module.exports = dal
