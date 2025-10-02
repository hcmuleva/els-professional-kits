Feature: Level 1 - Basic Authentication

  Background:
    * url baseUrl
    * def timestamp = function(){ return java.lang.System.currentTimeMillis() }

  Scenario: Register a new user
    * def username = 'user' + timestamp()
    * def email = username + '@test.com'
    
    Given path '/auth/local/register'
    And request
      """
      {
        "username": "#(username)",
        "email": "#(email)",
        "password": "Test@123456"
      }
      """
    When method POST
    Then status 200
    And match response.jwt == '#string'
    And match response.user.username == username
    And match response.user.email == email
    And print 'User registered successfully:', username

  Scenario: Login with registered user
    * def username = 'user' + timestamp()
    * def email = username + '@test.com'
    * def password = 'Test@123456'
    
    Given path '/auth/local/register'
    And request { "username": "#(username)", "email": "#(email)", "password": "#(password)" }
    When method POST
    Then status 200
    And print 'Registration successful'
    
    Given path '/auth/local'
    And request { "identifier": "#(username)", "password": "#(password)" }
    When method POST
    Then status 200
    And match response.jwt == '#string'
    And match response.user.username == username
    And print 'Login successful for user:', username

  Scenario: Login with email instead of username
    * def username = 'user' + timestamp()
    * def email = username + '@test.com'
    * def password = 'Test@123456'
    
    Given path '/auth/local/register'
    And request { "username": "#(username)", "email": "#(email)", "password": "#(password)" }
    When method POST
    Then status 200
    
    Given path '/auth/local'
    And request { "identifier": "#(email)", "password": "#(password)" }
    When method POST
    Then status 200
    And match response.jwt == '#string'
    And match response.user.email == email
    And print 'Login with email successful'

  Scenario: Get current user information
    * def username = 'user' + timestamp()
    * def email = username + '@test.com'
    
    Given path '/auth/local/register'
    And request { "username": "#(username)", "email": "#(email)", "password": "Test@123456" }
    When method POST
    Then status 200
    * def jwt = response.jwt
    * def userId = response.user.id
    
    Given path '/users/me'
    And header Authorization = 'Bearer ' + jwt
    When method GET
    Then status 200
    And match response.id == userId
    And match response.username == username
    And print 'User info retrieved successfully'
