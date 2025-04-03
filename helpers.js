//function to chekck if user email already exists in the database
const getUserByEmail = function(email, database) {
  for (let key in database) {
    if (database[key].email === email) {
      return database[key];        //return user if match found
    }
  }

  return null;

};

module.exports = { getUserByEmail };