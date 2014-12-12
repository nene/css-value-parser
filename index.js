var Parser = require("./lib/Parser");
var Formatter = require("./lib/Formatter");

module.exports = {
    parse: function(text) {
        return new Parser(text).parse();
    },

    format: function(parts) {
        return new Formatter(parts).format();
    }
};
