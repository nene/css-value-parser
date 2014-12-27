var parser = require("../index");
var expect = require("chai").expect;

describe("css-value-parser", function(){
    describe("formats value", function(){
        var tests = [
            // Dimensions
            ["15px", {type: "dimension", value: 15, unit: "px"}],
            ["-100em", {type: "dimension", value: -100, unit: "em"}],
            ["0.8ex", {type: "dimension", value: 0.8, unit: "ex"}],
            ["360deg", {type: "dimension", value: 360, unit: "deg"}],
            ["-3.14cm", {type: "dimension", value: -3.14, unit: "cm"}],
            ["0.3vh", {type: "dimension", value: 0.3, unit: "vh"}],
            // Percentages
            ["25%", {type: "percentage", value: 25}],
            ["0.51%", {type: "percentage", value: 0.51}],
            // Numbers
            ["17", {type: "number", value: 17}],
            ["-0.26", {type: "number", value: -0.26}],
            // Strings
            ['"world"', {type: "string", value: "world"}],
            ['"with\'quotes"', {type: "string", value: "with'quotes"}],
            ['"with\\"quotes"', {type: "string", value: "with\"quotes"}],
            ['"escape: \\\\ "', {type: "string", value: 'escape: \\ '}],
            ['"newline: \\\n line"', {type: "string", value: 'newline: \n line'}],
            // Operators
            [",", {type: "operator", value: ","}],
            ["/", {type: "operator", value: "/"}],
            ["+", {type: "operator", value: "+"}],
            ["*", {type: "operator", value: "*"}],
            ["-", {type: "operator", value: "-"}],
            // Colors
            ["#f0f", {type: "color", value: "#f0f"}],
            ["green", {type: "color", value: "green"}],
            // Identifiers
            ["inherit", {type: "identifier", value: "inherit"}],
            ["-moz-custom-extension", {type: "identifier", value: "-moz-custom-extension"}],
            // URIs
            ["url(http://example.com)", {type: "uri", value: "http://example.com"}],
            // Functions
            ["func(10px)", {type: "function", name: "func", params: [
                {type: "dimension", value: 10, unit: "px"},
            ]}],
            ["rgb(255, 255, 0)", {type: "function", name: "rgb", params: [
                {type: "number", value: 255},
                {type: "number", value: 255},
                {type: "number", value: 0},
            ]}],
            ["rgba(10%, 50%, 100%, 0.5)", {type: "function", name: "rgba", params: [
                {type: "percentage", value: 10},
                {type: "percentage", value: 50},
                {type: "percentage", value: 100},
                {type: "number", value: 0.5},
            ]}],
            ["hsl(10%, 50%, 100%)", {type: "function", name: "hsl", params: [
                {type: "percentage", value: 10},
                {type: "percentage", value: 50},
                {type: "percentage", value: 100},
            ]}],
            ["hsla(128, 128, 128, 0.7)", {type: "function", name: "hsla", params: [
                {type: "number", value: 128},
                {type: "number", value: 128},
                {type: "number", value: 128},
                {type: "number", value: 0.7},
            ]}],
            ['url("http://example.com")', {type: "function", name: "url", params: [
                {type: "string", value: "http://example.com"},
            ]}],
            ["calc(5px + 10% / 5 * 3)", {type: "function", name: "calc", params: [
                {type: "dimension", value: 5, unit: "px"},
                {type: "operator", value: "+"},
                {type: "percentage", value: 10},
                {type: "operator", value: "/"},
                {type: "number", value: 5},
                {type: "operator", value: "*"},
                {type: "number", value: 3},
            ]}],
            // Nested functions
            [
                "-webkit-gradient(linear, color-stop(0%, #CCC), color-stop(100%, rgb(0, 0, 0)))",
                {type: "function", name: "-webkit-gradient", params: [
                    {type: "identifier", value: "linear"},
                    {type: "function", name: "color-stop", params: [
                        {type: "percentage", value: 0},
                        {type: "color", value: "#CCC"},
                    ]},
                    {type: "function", name: "color-stop", params: [
                        {type: "percentage", value: 100},
                        {type: "function", name: "rgb", params: [
                            {type: "number", value: 0},
                            {type: "number", value: 0},
                            {type: "number", value: 0},
                        ]},
                    ]},
                ]}
            ],
            // Multiple values
            ['bold italic 12px / 1.5 "Times New Roman" , Times , serif', [
                {type: "identifier", value: "bold"},
                {type: "identifier", value: "italic"},
                {type: "dimension", value: 12, unit: "px"},
                {type: "operator", value: "/"},
                {type: "number", value: 1.5},
                {type: "string", value: "Times New Roman"},
                {type: "operator", value: ","},
                {type: "identifier", value: "Times"},
                {type: "operator", value: ","},
                {type: "identifier", value: "serif"},
            ]]
        ];

        tests.forEach(function(item) {
            var code = item[0];
            var valueObjs = item[1];

            it(code, function() {
                expect(parser.format(valueObjs)).to.eql(code);
            });
        });
    });
});
