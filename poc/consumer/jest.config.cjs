const { transformFile } = require("@babel/core");

module.exports = {
    transform: {
        "^.+\\.jsx?$": "babel-jest"
    }
}