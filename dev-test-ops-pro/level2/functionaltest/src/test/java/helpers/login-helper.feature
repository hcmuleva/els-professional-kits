Feature: Helper - Login User

  Scenario: Login user helper
    * def identifier = karate.get('identifier')
    * def password = karate.get('password')
    
    Given url baseUrl
    And path '/auth/local'
    And request
      """
      {
        "identifier": "#(identifier)",
        "password": "#(password)"
      }
      """
    When method POST
    Then status 200
    * def jwt = response.jwt
    * def userId = response.user.id
