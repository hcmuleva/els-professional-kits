Feature: Create a business after successful registration and login

Background:
  * url baseUrl
  * configure headers = headers
  * def setupData = callonce read('setup.feature')
  * def authToken = setupData.token
  * def userId = setupData.userId
  * def username = setupData.username
  * print '🧩 Using user:', username, 'ID:', userId

Scenario: Create a new business entry
  * def businessName = 'Business_' + java.util.UUID.randomUUID().toString()

  Given path 'businesses'
  And header Authorization = 'Bearer ' + authToken
  And request { data: { users_permissions_user: '#(userId)', name: '#(businessName)' } }
  When method post
  Then status 200

  * print '✅ Business created successfully:', response
  * match response.data.attributes.name == businessName
