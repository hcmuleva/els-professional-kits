Feature: Setup user and login to get token and user id

Background:
  * url baseUrl
  * configure headers = headers

Scenario: Register and login user
  * def rand = java.util.UUID.randomUUID().toString()
  * def username = 'user_' + rand
  * def email = username + '@a.com'
  * def password = 'secret'

  # Register user
  Given path 'auth/local/register'
  And request { username: '#(username)', email: '#(email)', password: '#(password)', role: 1 }
  When method post
  Then status 200
  * print '✅ User registered:', response

  # Login user
  Given path 'auth/local'
  And request { identifier: '#(email)', password: '#(password)' }
  When method post
  Then status 200
  * print '✅ Login successful:', response

  # Extract details
  * def token = response.jwt
  * def userId = response.user.id
  * def result =
  """
  {
    username: '#(username)',
    email: '#(email)',
    password: '#(password)',
    token: '#(token)',
    userId: '#(userId)'
  }
  """
  * print 'Setup returning token:', result.token
  * print 'Setup returning userId:', result.userId
  * match result.userId != null
  * match result.token != null
  * match result.username != null
  * match result.email != null
  * karate.set('result', result)
