//function to chekck if user email already exists in the database
const getUserByEmail = function(email, database) {
  for (let key in database) {
    if (database[key].email === email) {
      return database[key];        //return user if match found
    }
  }

  return undefined;

};


//function to generate a random six-character string
function generateRandomString() {
  const charPool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const poolLength = charPool.length;

  let output = '';

  // take a random position from the charPool string and add to output (*6)
  for (let outputDigit = 0; outputDigit < 6; outputDigit++) {
    charIndex = Math.floor(Math.random() * poolLength)
    output += charPool[charIndex];
  }

  return output;

}

module.exports = { 
  getUserByEmail,
  generateRandomString
 };