Feature: Level 3 - Strapi User Management

  Background:
    * url baseUrl
    * def randomEmail = function(){ return 'user' + java.lang.System.currentTimeMillis() + '@test.com' }
    * def randomUsername = function(){ return 'user' + java.lang.System.currentTimeMillis() }
    * def testUser = call read('classpath:helpers/create-user.feature')
    * def jwt = testUser.jwt
    * def currentUserId = testUser.userId

  Scenario: Get current authenticated user details
    Given path '/users/me'
    And header Authorization = 'Bearer ' + jwt
    When method GET
    Then status 200
    And match response.id == currentUserId
    And match response.username == '#string'
    And match response.confirmed == '#boolean'

  Scenario: Get all users with pagination
    Given path '/users'
    And header Authorization = 'Bearer ' + jwt
    And param _limit = 10
    And param _start = 0
    When method GET
    Then status 200
    And match response == '#array'

  Scenario: Get user by ID
    Given path '/users/' + currentUserId
    And header Authorization = 'Bearer ' + jwt
    When method GET
    Then status 200
    And match response.id == currentUserId

  Scenario: Update current user details
    * def newUsername = randomUsername()
    
    Given path '/users/' + currentUserId
    And header Authorization = 'Bearer ' + jwt
    And request { "username": "#(newUsername)" }
    When method PUT
    Then status 200
    And match response.username == newUsername

  Scenario: Get users count
    Given path '/users/count'
    And header Authorization = 'Bearer ' + jwt
    When method GET
    Then status 200
    And match response == '#number'

  Scenario: Search users with filters
    Given path '/users'
    And header Authorization = 'Bearer ' + jwt
    And param _limit = 5
    And param _sort = 'createdAt:DESC'
    When method GET
    Then status 200
    And match response == '#array'
