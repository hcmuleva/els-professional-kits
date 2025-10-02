Feature: Setup user and login to get token

Background:
  * url baseUrl
  * configure headers = headers

Scenario: Register and login user
  * def rand = java.util.UUID.randomUUID().toString()
  * def uname = 'user_' + rand
  * def email = uname + '@a.com'
  * def password = 'secret'

  # Register
  Given path 'register'
  And request { username: '#(uname)', email: '#(email)', password: '#(password)' }
  When method post
  Then status 201

  # Login
  Given path 'login'
  And request { email: '#(email)', password: '#(password)' }
  When method post
  Then status 200

  # Prepare return object
  * def result =
  """
  {
    uname: '#(uname)',
    email: '#(email)',
    password: '#(password)',
    token: '#(response.token)'
  }
  """
  * print 'Setup returning token:', result.token
