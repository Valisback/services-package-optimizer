const aiAttributesCollection = require('../constants/dbSettings').aiAttributesCollection;

const addData = (data) => {
  return aiAttributesCollection.add(data)
    .then((docRef) => {
      console.log(`Document added with ID: ${docRef.id} docRef: ${JSON.stringify(docRef)}`);
      return;
    });
};

const setData = ( id, data) => {
  return aiAttributesCollection.doc(id).set(data)
    .then((docRef) => {
      console.log(`Document set with ID: ${id} docRef : ${JSON.stringify(docRef)}`);
      return;
    });
};

const saveData = (id, data) => {
  if(id) {
    return setData(id,data);
  } else {
    return addData(data);
  }
};

module.exports = saveData;