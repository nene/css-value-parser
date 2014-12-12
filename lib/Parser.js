var colors = require("./colors");

function Parser(text) {
    this.text = text;
}
Parser.prototype = {
    parse: function() {
        var parts = [];
        while (this.text.length > 0) {
            var value = this.parseValue();
            if (value) {
                if (this.isCloseParen(value)) {
                    break;
                }
                parts.push(value);
            }
        }
        return parts;
    },

    parseValue: function() {
        this.parseWhitespace();

        if (this.match(/^([+\-]?[\d\.]+)([a-z]+)/i)) {
            return {
                type: "dimension",
                value: +this.matches[1],
                unit: this.matches[2]
            };
        }
        else if (this.match(/^([+\-]?[\d\.]+)%/i)) {
            return {
                type: "percentage",
                value: +this.matches[1]
            };
        }
        else if (this.match(/^([+\-]?[\d\.]+)/i)) {
            return {
                type: "number",
                value: +this.matches[1]
            };
        }
        else if (this.match(/^(#[a-f0-9]{3,6})/i)) {
            return {
                type: "color",
                value: this.matches[1]
            };
        }
        else if (this.match(/^("([^"\\]|\\[\s\S])*")/) || this.match(/^('([^'\\]|\\[\s\S])*')/)) {
            return {
                type: "string",
                value: this.unescapeString(this.matches[1])
            };
        }
        else if (this.match(/^([a-z\-_\u0080-\uFFFF][a-z0-9\-_\u0080-\uFFFF]*)/i)) {
            var ident = this.matches[1];

            if (this.match(/^\(/)) {
                return this.parseFunction(ident);
            }
            else {
                return this.parseIdent(ident);
            }
        }
        else if (this.match(/^(.)/)) {
            return {
                type: "operator",
                value: this.matches[1]
            };
        }
    },

    unescapeString: function(str) {
        return str.slice(1, str.length-1).replace(/\\([\s\S])/g, function(all, char) {
            return char;
        });
    },

    parseFunction: function(fname) {
        if (fname === "url" && this.match(/^\s*([^'")\s][^)\s]*)\s*\)/)) {
            return {
                type: "uri",
                value: this.matches[1]
            };
        }
        else {
            return {
                type: "function",
                name: fname,
                params: this.parseParams()
            };
        }
    },

    parseParams: function() {
        return this.parse().filter(function(value){
            return !this.isComma(value);
        }, this);
    },

    parseIdent: function(ident) {
        if (colors[ident.toLowerCase()]) {
            return {
                type: "color",
                value: ident
            };
        }
        else {
            return {
                type: "identifier",
                value: ident
            };
        }
    },

    parseWhitespace: function() {
        this.match(/^\s+/);
    },

    isCloseParen: function(value) {
        return value.type === "operator" && value.value === ")";
    },

    isComma: function(value) {
        return value.type === "operator" && value.value === ",";
    },

    match: function(regex) {
        this.matches = this.text.match(regex);
        if (this.matches) {
            this.text = this.text.slice(this.matches[0].length);
            return true;
        }
        return false;
    },

    look: function(regex) {
        return regex.test(this.text);
    }
};

module.exports = Parser;
