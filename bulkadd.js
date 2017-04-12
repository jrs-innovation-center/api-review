const PouchDB = require('pouchdb-http')
PouchDB.plugin(require('pouchdb-mapreduce'))
const couch_base_uri = "http://127.0.0.1:5984/"  //5984...most of us need to change this to 3000
const couch_dbname = "pharma-student" //...many of us will need to change this to pharmacy
const db = new PouchDB(couch_base_uri + couch_dbname)

const docs = [{
        "_id": "patient_freeman_brenda_3066_6453927",
        "type": "patient",
        "patientNumber": 6453927,
        "firstName": "Brenda",
        "lastName": "Freeman",
        "birthdate": "1997-09-02",
        "gender": "F",
        "ethnicity": "W",
        "last4SSN": 3066,
        "conditions": [
            "Depression",
            "Asthma"
        ]
    },
    {
        "_id": "patient_martin_diana_8039_7231651",
        "type": "patient",
        "patientNumber": 7231651,
        "firstName": "Diana",
        "lastName": "Martin",
        "birthdate": "1966-05-30",
        "gender": "F",
        "ethnicity": "W",
        "last4SSN": 8039,
        "conditions": [
            "Hypertension"
        ]
    },

    {
        "_id": "patient_austin_steve_3033_1001",
        "patientNumber": 1001,
        "firstName": "Steve",
        "lastName": "Austin",
        "birthdate": "1940-09-01",
        "gender": "M",
        "ethnicity": "W",
        "last4SSN": 3033,
        "conditions": [
            "Depression",
            "Hypertension"
        ],
        "type": "patient"
    },

    {
        "_id": "_design/patientsByLastName",
        "views": {
            "patientsByLastName": {
                "map": "function (doc) {\n   if (doc.type === 'patient')\n  emit(doc.lastName, null);\n}"
            }
        },
        "language": "javascript"
    },
    {
        "_id": "_design/patientsByCondition",
        "views": {
            "patientsByCondition": {
                "map": "function (doc) {\n  if (doc.type === 'patient')\n  doc.conditions.forEach(function(element) {\n    emit(element, null);\n  })\n}\n"
            }
        },
        "language": "javascript"
    },

    {
        "_id": "medication_nicorette_100mg_patch",
        "label": "Nicorette 100mg patch",
        "ingredients": [
            "nicotene",
            "tamezipam"
        ],
        "amount": "100",
        "unit": "mg",
        "form": "patch",
        "type": "medication"
    },


    {
        "_id": "medication_spironolactone_100mg_patch",
        "label": "Spironolactone 100mg patch",
        "ingredients": [
            "spironolactone"
        ],
        "amount": "100",
        "unit": "mg",
        "form": "patch",
        "type": "medication"
    },

    {
        "_id": "medication_amlodipine_20mg_syrup",
        "label": "Amlodipine 20mg syrup",
        "ingredients": [
            "Amlodipine",
            "Aspirin"
        ],
        "amount": "20",
        "unit": "mg",
        "form": "syrup",
        "type": "medication"
    },


    {
        "_id": "_design/medsByForm",

        "views": {
            "medsByForm": {
                "map": "function (doc) {\n  if (doc.type ===\"medication\") {\n      emit(doc.form, null);\n  }\n}"
            }
        },
        "language": "javascript"
    },

    {
        "_id": "_design/medsByIngredient",
        "views": {
            "medsByIngredient": {
                "map": "function (doc) {\n  if (doc.type ===\"medication\") {\n    doc.ingredients.forEach(function(ingredientName) {\n      emit(ingredientName,null);\n    })\n  }\n}"
            }
        },
        "language": "javascript"
    },

    {
        "_id": "_design/medsByLabel",
        "views": {
            "medsByLabel": {
                "map": "function (doc) {\n  if (doc.type ===\"medication\") {\n     emit(doc.label,null);\n  }\n \n}"
            }
        },
        "language": "javascript"
    },

    {
        "_id": "pharmacy_Walgreens_Hwy_17_S._Myrtle_Beach_1004",
        "type": "pharmacy",
        "storeNumber": "1004",
        "storeChainName": "Walgreens",
        "storeName": "Hwy 17 S. Myrtle Beach",
        "streetAddress": "250 South Myrtle Beach Market Road",
        "phone": "843-777-1111",
        "city": "Myrtle Beach",
        "state": "SC",
        "zip": "29345"
    },

    {
        "_id": "pharmacy_Walmart_Hwy_17_1004",
        "type": "pharmacy",
        "storeNumber": "1004",
        "storeChainName": "Walmart",
        "storeName": "Hwy 17",
        "streetAddress": "100 Oakland Market Road",
        "phone": "843-888-1111",
        "city": "Mount Pleasant",
        "state": "SC",
        "zip": "29466"
    },

    {
        "_id": "pharmacy_CVS_Belle_Hall_1001",
        "type": "pharmacy",
        "storeNumber": "1001",
        "storeChainName": "CVS",
        "storeName": "Belle Hall",
        "streetAddress": "2000 Belle Hall Lane",
        "phone": "843-881-5644",
        "city": "Mount Pleasant",
        "state": "SC",
        "zip": "29464"
    },


    {
        "_id": "_design/pharmacies",
        "views": {
            "pharmacies": {
                "map": "function (doc) {\n  if (doc.type===\"pharmacy\") {\n    emit(doc._id, null);\n  }\n}"
            }
        },
        "language": "javascript"
    },

    {
        "_id": "_design/pharmaciesByChainName",
        "views": {
            "pharmaciesByChainName": {
                "map": "function (doc) {\n  if (doc.type === \"pharmacy\")\n  emit(doc.storeChainName, null);\n}"
            }
        },
        "language": "javascript"
    },
    {
        "_id": "_design/pharmacyByStoreName",

        "views": {
            "pharmacyByStoreName": {
                "map": "function (doc) {\n  if (doc.type === \"pharmacy\")\n  emit(doc.storeName, null);\n}"
            }
        },
        "language": "javascript"
    }

]

db.bulkDocs(docs, function(err, res) {
    if (err) return console.log(err);
    console.log(res)
})
