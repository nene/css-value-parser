var Parser = require("./lib/Parser");

module.exports = {
    parse: function(text) {
        return new Parser(text).parse();
    }
};
