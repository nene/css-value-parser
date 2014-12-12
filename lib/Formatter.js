
function Formatter(parts) {
    this.parts = parts;
}
Formatter.prototype = {
    format: function() {
        return this.parts.map(this.formatValue, this).join(" ");
    },

    formatValue: function(val) {
        switch (val.type) {
            case "dimension":
            return val.value + val.unit;
            case "percentage":
            return val.value + "%";
            case "number":
            return val.value + "";
            case "string":
            return '"' + this.escapeString(val.value) + '"';
            case "operator":
            return val.value;
            case "color":
            return val.value;
            case "identifier":
            return val.value;
            case "uri":
            return "url(" + val.value + ")";
            case "function":
            return this.formatFunction(val.name, val.params);
        }
    },

    escapeString: function(str) {
        return str.replace(/["\\\n]/g, function(char) {
            return "\\" + char;
        });
    },

    formatFunction: function(name, params) {
        var separator = (name === "calc") ? " " : ", ";

        return name + "(" + params.map(this.formatValue, this).join(separator) + ")";
    }
};

module.exports = Formatter;
