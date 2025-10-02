Feature: Auth API tests with shared setup

Background:
  * url baseUrl
  * configure headers = headers
  * def setupData = callonce read('setup.feature')
  * def uname = setupData.uname
  * def email = setupData.email
  * def password = setupData.password
  * def authToken = setupData.token

Scenario: Registration created the user
  # Verify structure matches expectations
  Given path 'login'
  And request { email: '#(email)', password: '#(password)' }
  When method post
  Then status 200
  And match response.user_role == "student"

Scenario: Login returns valid token
  Given path 'login'
  And request { email: '#(email)', password: '#(password)' }
  When method post
  Then status 200
  And match response.token == "#string"


Scenario: Login and then get users list in one flow

  # Step 1: Perform login and capture the token
  Given url baseUrl
  And path 'login'
  And request { email: '#(email)', password: '#(password)' }
  When method post
  Then status 200
  # Capture the token from the login response
  * def authToken = response.token  
  * print 'Token received:', authToken

  # Step 2: Use the token to access another endpoint
  Given url baseUrl
  And path 'users'
  # Use the token in the header
  And header Authorization = 'Bearer ' + authToken  
  When method get
  Then status 200

  # Add your verifications for the users list here
  And match each response ==
  """
  {
    id: "#number",
    username: "#string",
    email: "#string",
    role: "#string",
    created_at: "#string"
  }
  """