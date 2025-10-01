Feature: Level 2 - Data Driven Authentication with Extended Fields

  Background:
    * url baseUrl
    * def timestamp = function(){ return java.lang.System.currentTimeMillis() }
    * def randomEmail = function(){ return 'user' + java.lang.System.currentTimeMillis() + '@test.com' }
    * def randomUsername = function(){ return 'user' + java.lang.System.currentTimeMillis() }

  Scenario: Register user with first name and last name
    * def username = randomUsername()
    * def email = randomEmail()
    
    Given path '/auth/local/register'
    And request
      """
      {
        "username": "#(username)",
        "email": "#(email)",
        "password": "Test@123456",
        "first_name": "John",
        "last_name": "Doe"
      }
      """
    When method POST
    Then status 200
    And match response.jwt == '#string'
    And match response.user.username == username
    And print 'User registered with full name:', username

  Scenario Outline: Register multiple users - Data Driven
    * def uniqueUsername = '<username>' + timestamp()
    * def uniqueEmail = uniqueUsername + '@test.com'
    
    Given path '/auth/local/register'
    And request
      """
      {
        "username": "#(uniqueUsername)",
        "email": "#(uniqueEmail)",
        "password": "<password>",
        "first_name": "<firstName>",
        "last_name": "<lastName>"
      }
      """
    When method POST
    Then status 200
    And match response.user.username == uniqueUsername
    And print 'Registered user:', '<firstName>', '<lastName>'

    Examples:
      | username    | password      | firstName | lastName  |
      | john_user   | Pass@123456   | John      | Smith     |
      | jane_user   | Pass@123456   | Jane      | Doe       |
      | bob_user    | Pass@123456   | Bob       | Johnson   |
      | alice_user  | Pass@123456   | Alice     | Williams  |

  Scenario: Register multiple users using Table
    * table testUsers
      | username    | password      | firstName | lastName  |
      | 'user1'     | 'Pass@123456' | 'Alex'    | 'Turner'  |
      | 'user2'     | 'Pass@123456' | 'Emma'    | 'Watson'  |
      | 'user3'     | 'Pass@123456' | 'Oliver'  | 'Smith'   |
    
    * def registerUser =
      """
      function(user) {
        var ts = java.lang.System.currentTimeMillis();
        var uniqueUsername = user.username + ts;
        var uniqueEmail = uniqueUsername + '@test.com';
        
        var result = karate.call('classpath:helpers/register-helper.feature', {
          username: uniqueUsername,
          email: uniqueEmail,
          password: user.password,
          firstName: user.firstName,
          lastName: user.lastName
        });
        
        karate.log('Registered:', user.firstName, user.lastName);
        return result;
      }
      """
    
    * def results = karate.map(testUsers, registerUser)
    * print 'Total users registered:', results.length

  Scenario: Read user data from JSON and register
    * def userData = read('classpath:testdata/users.json')
    
    * def registerFromJson =
      """
      function(user) {
        var ts = java.lang.System.currentTimeMillis();
        var result = karate.call('classpath:helpers/register-helper.feature', {
          username: user.username + ts,
          email: user.username + ts + '@test.com',
          password: user.password,
          firstName: user.first_name,
          lastName: user.last_name
        });
        return result;
      }
      """
    
    * def results = karate.map(userData, registerFromJson)
    * print 'Registered', results.length, 'users from JSON file'
