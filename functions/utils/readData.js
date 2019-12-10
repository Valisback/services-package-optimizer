const aiAttributesCollection = require('../constants/dbSettings').aiAttributesCollection;

// valid query types
const queryTypes = ["getDocument", "getAnswers"];

const readApi = {

  getDocument : (query) => {
    var docRef = aiAttributesCollection.doc(query.docId);
    return docRef.get().then( doc  =>  doc.data());
  },

  getAnswers : (query) => {
    return readApi.getDocument(query).then( doc => doc.form_response.answers);
  }

};

const readData = (query) => new Promise((resolve, reject) =>  {

  // check if query type is valid an call correct method
  if(query.queryType && queryTypes.indexOf(query.queryType) > -1 ) {
    resolve(readApi[query.queryType](query));
  } else {
    reject(new Error(`Invalid query type requested [${query.queryType}]`));
  }

});

module.exports = readData;