const { assert } = require('chai');

const { getUserByEmail, urlsForUser } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    assert.equal(user.id, expectedUserID);
  });

  it('should return undefined if the email does not exist', function() {
    const result = getUserByEmail("random@email.com", testUsers)
    const expectedResult = undefined;
    assert.equal(result, expectedResult);
  });
});

// Updated mock urlDatabase for testing
const urlDatabase = {
  "abc123": { longURL: "https://www.example.com", userID: "userA" },
  "xyz456": { longURL: "https://www.test.com", userID: "userB" },
  "lmn789": { longURL: "https://www.sample.com", userID: "userA" },
  "pqr321": { longURL: "https://www.demo.com", userID: "userC" },
};

// Test suite for urlsForUser
describe('urlsForUser', function() {

  it('should return urls that belong to the specified user', function() {
    const userID = "userA";
    const expectedOutput = {
      "abc123": { longURL: "https://www.example.com", userID: "userA" },
      "lmn789": { longURL: "https://www.sample.com", userID: "userA" }
    };
    const result = urlsForUser(userID, urlDatabase);
    assert.deepEqual(result, expectedOutput, 'Returned URLs do not match the expected output for userA');
  });

  it('should return an empty object if no urls belong to the specified user', function() {
    const userID = "userD"; // User ID not present in urlDatabase
    const expectedOutput = {};
    const result = urlsForUser(userID, urlDatabase);
    assert.deepEqual(result, expectedOutput, 'Expected an empty object when no URLs belong to the user');
  });

  it('should return an empty object if the urlDatabase is empty', function() {
    const userID = "userA";
    const emptyDatabase = {}; // Empty urlDatabase
    const expectedOutput = {};
    const result = urlsForUser(userID, emptyDatabase);
    assert.deepEqual(result, expectedOutput, 'Expected an empty object when urlDatabase is empty');
  });

  it('should not return any urls that do not belong to the specified user', function() {
    const userID = "userB";
    const result = urlsForUser(userID, urlDatabase);
    // Ensure no URLs from other users are included
    for (const shortURL in result) {
      assert.equal(result[shortURL].userID, userID, `Found a URL that does not belong to ${userID}`);
    }
  });

});