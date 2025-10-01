Feature: Level 3 - Advanced Strapi Authentication

  Background:
    * url baseUrl
    * def randomEmail = function(){ return 'user' + java.lang.System.currentTimeMillis() + '@test.com' }
    * def randomUsername = function(){ return 'user' + java.lang.System.currentTimeMillis() }

  Scenario: Register a new user successfully
    Given path '/auth/local/register'
    And request
      """
      {
        "username": "#(randomUsername())",
        "email": "#(randomEmail())",
        "password": "Test@123456"
      }
      """
    When method POST
    Then status 200
    And match response.jwt == '#string'
    And match response.user.id == '#number'
    And match response.user.username == '#string'
    And match response.user.confirmed == '#boolean'

  Scenario: Register user with duplicate username should fail
    * def username = randomUsername()
    * def email = randomEmail()
    
    Given path '/auth/local/register'
    And request { "username": "#(username)", "email": "#(email)", "password": "Test@123456" }
    When method POST
    Then status 200
    
    Given path '/auth/local/register'
    And request { "username": "#(username)", "email": "#(randomEmail())", "password": "Test@123456" }
    When method POST
    Then status 400
    And match response.error != null

  Scenario: Login with valid credentials using identifier
    * def username = randomUsername()
    * def email = randomEmail()
    * def password = 'Test@123456'
    
    Given path '/auth/local/register'
    And request { "username": "#(username)", "email": "#(email)", "password": "#(password)" }
    When method POST
    Then status 200
    
    Given path '/auth/local'
    And request { "identifier": "#(username)", "password": "#(password)" }
    When method POST
    Then status 200
    And match response.jwt == '#string'
    And match response.user.username == username

  Scenario: Login with invalid credentials should fail
    Given path '/auth/local'
    And request { "identifier": "nonexistent@test.com", "password": "wrongpassword" }
    When method POST
    Then status 400
    And match response.error != null

  Scenario Outline: Register validation - missing required fields
    Given path '/auth/local/register'
    And request
      """
      {
        "username": "<username>",
        "email": "<email>",
        "password": "<password>"
      }
      """
    When method POST
    Then status 400
    And match response.error != null

    Examples:
      | username         | email              | password    |
      |                  | test@test.com      | Test@123    |
      | testuser         |                    | Test@123    |
      | testuser         | test@test.com      |             |

  Scenario: Get authenticated user information
    * def username = randomUsername()
    * def email = randomEmail()
    
    Given path '/auth/local/register'
    And request { "username": "#(username)", "email": "#(email)", "password": "Test@123456" }
    When method POST
    Then status 200
    * def jwt = response.jwt
    
    Given path '/users/me'
    And header Authorization = 'Bearer ' + jwt
    When method GET
    Then status 200
    And match response.username == username

  Scenario: Access protected endpoint without token should fail
    Given path '/users/me'
    When method GET
    Then status 401
