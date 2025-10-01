Feature: Helper - Create User and Login for Strapi

  Scenario: Create a test user and return JWT token
    * def randomEmail = function(){ return 'user' + java.lang.System.currentTimeMillis() + '@test.com' }
    * def randomUsername = function(){ return 'user' + java.lang.System.currentTimeMillis() }
    * def email = randomEmail()
    * def username = randomUsername()
    * def password = 'Test@123456'
    
    Given url baseUrl
    And path '/auth/local/register'
    And request { "username": "#(username)", "email": "#(email)", "password": "#(password)" }
    When method POST
    Then status 200
    * def jwt = response.jwt
    * def userId = response.user.id
