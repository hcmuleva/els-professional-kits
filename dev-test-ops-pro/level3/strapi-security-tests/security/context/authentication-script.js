// ZAP Authentication Script for Strapi
// This script handles JWT authentication for Strapi APIs

function authenticate(helper, paramsValues, credentials) {
    var loginUrl = "http://host.docker.internal:1338/api/auth/local";
    var username = credentials.getParam("username");
    var password = credentials.getParam("password");
    
    var loginData = JSON.stringify({
        identifier: username,
        password: password
    });
    
    var msg = helper.prepareMessage();
    msg.setRequestHeader("POST " + loginUrl + " HTTP/1.1");
    msg.setRequestHeader("Content-Type: application/json");
    msg.setRequestBody(loginData);
    
    helper.sendAndReceive(msg);
    
    var response = msg.getResponseBody().toString();
    var jwtToken = extractToken(response);
    
    if (jwtToken) {
        helper.getAuthenticationState().setAuthToken(jwtToken);
        return true;
    }
    
    return false;
}

function extractToken(response) {
    try {
        var json = JSON.parse(response);
        return json.jwt;
    } catch (e) {
        return null;
    }
}

function getRequiredParamsNames() {
    return ["username", "password"];
}

function getOptionalParamsNames() {
    return [];
}

function getCredentialsParamsNames() {
    return ["username", "password"];
}
