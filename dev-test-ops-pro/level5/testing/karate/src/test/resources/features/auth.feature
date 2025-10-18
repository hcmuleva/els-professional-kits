Feature: Auth API tests with shared setup

Background:
  * url baseUrl
  * configure headers = headers
  * def setupData = callonce read('setup.feature')
  * def username = setupData.username
  * def email = setupData.email
  * def password = setupData.password
  * def authToken = setupData.token

Scenario: Registration created the user
  # Verify structure matches expectations
  Given path 'auth/local'
  And request { identifier: '#(email)', password: '#(password)' }
  When method post
  Then status 200

Scenario: Login returns valid token
  Given path 'auth/local'
  And request { identifier: '#(email)', password: '#(password)' }
  When method post
  Then status 200
  And match response.jwt == "#string"


Scenario: Login and then get users list in one flow

  # Step 1: Perform login and capture the token
  Given url baseUrl
  And path 'auth/local'
  And request { identifier: '#(email)', password: '#(password)' }
  When method post
  Then print 'Login response:', response
  And status 200

  # Capture the token from the login response
  * def authToken = response.jwt 
  * print 'Token received:', authToken

  # Step 2: Use the token to access another endpoint
  Given url baseUrl
  And path 'users'
  # Use the token in the header
  And header Authorization = 'Bearer ' + authToken  
  When method get
  Then status 200
  * print 'Response received:', response
  Then status 200
* def firstUser = response.data[0]
* match firstUser.id != null
* match firstUser.username != null
* match firstUser.email != null

  # # Add your verifications for the users list here
  # And match each response ==
  # """
  # {
  #   data.username: "#string",
  #   data.email: "#string",
  # }
 # """