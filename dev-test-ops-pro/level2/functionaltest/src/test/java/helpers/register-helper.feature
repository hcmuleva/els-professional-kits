Feature: Helper - Register User with Extended Fields

  Scenario: Register user helper
    * def username = karate.get('username')
    * def email = karate.get('email')
    * def password = karate.get('password')
    * def firstName = karate.get('firstName')
    * def lastName = karate.get('lastName')
    
    Given url baseUrl
    And path '/auth/local/register'
    And request
      """
      {
        "username": "#(username)",
        "email": "#(email)",
        "password": "#(password)",
        "first_name": "#(firstName)",
        "last_name": "#(lastName)"
      }
      """
    When method POST
    Then status 200
    * def jwt = response.jwt
    * def userId = response.user.id
