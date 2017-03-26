'use strict';

var fs = require('fs'),
    esprimafb = require('esprima-fb'),
    escodegen = require('./loader'),
    chai = require('chai'),
    expect = chai.expect;

function test(code, expected) {
    var tree, actual, options, StringObject;

    // alias, so that JSLint does not complain.
    StringObject = String;

    options = {
        range: true,
        loc: false,
        tokens: true,
        raw: false
    };

    tree = esprimafb.parse(code, options);

    // for UNIX text comment
    actual = escodegen.generate(tree).replace(/[\n\r]$/, '') + '\n';
    fs.writeFileSync(__dirname + '/../../__tmp/__tree.json', JSON.stringify(tree, '', '  '));
    fs.writeFileSync(__dirname + '/../../__tmp/__actual.jsx', actual);
    expect(actual).to.be.equal(expected);
}

describe('compare-jsx test', function () {
    fs.readdirSync(__dirname + '/compare-jsx').sort().forEach(function(file) {
        var code, expected, p;
        if (/element-statement\.jsx$/.test(file) && !/expected\.jsx$/.test(file)) {
            it(file, function () {
                p = file.replace(/\.jsx$/, '.expected.jsx');
                code = fs.readFileSync(__dirname + '/compare-jsx/' + file, 'utf-8');
                expected = fs.readFileSync(__dirname + '/compare-jsx/' + p, 'utf-8');
                test(code, expected);
            });
        }
    });
});
