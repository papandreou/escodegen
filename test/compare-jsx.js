'use strict';

var fs = require('fs'),
    acorn = require('acorn-jsx'),
    esprima = require('esprima'),
    escodegen = require('./loader'),
    chai = require('chai'),
    expect = chai.expect;

function testAcorn(code, expected) {
    var tree, actual, options, StringObject;

    // alias, so that JSLint does not complain.
    StringObject = String;

    options = {
        ranges: true,
        locations: false,
        ecmaVersion: 6,
        plugins: {
            jsx: true
        }
    };

    tree = acorn.parse(code, options);

    // for UNIX text comment
    actual = escodegen.generate(tree).replace(/[\n\r]$/, '') + '\n';
    expect(actual).to.be.equal(expected);
}

function testEsprima(code, expected) {
    var tree, actual, options, StringObject;

    // alias, so that JSLint does not complain.
    StringObject = String;

    options = {
        range: true,
        loc: false,
        tokens: true,
        raw: false,
        jsx: true
    };

    tree = esprima.parse(code, options);

    // for UNIX text comment
    actual = escodegen.generate(tree).replace(/[\n\r]$/, '') + '\n';
    expect(actual).to.be.equal(expected);
}

describe('compare-jsx test', function () {
    fs.readdirSync(__dirname + '/compare-jsx').sort().forEach(function(file) {
        var code, expected, p;
        if (/\.jsx$/.test(file) && !/expected\.jsx$/.test(file)) {
            p = file.replace(/\.jsx$/, '.expected.jsx');
            code = fs.readFileSync(__dirname + '/compare-jsx/' + file, 'utf-8');
            expected = fs.readFileSync(__dirname + '/compare-jsx/' + p, 'utf-8');
            it(file + ' (acorn)', function () {
                testAcorn(code, expected);
            });

            it(file + ' (esprima)', function () {
                testEsprima(code, expected);
            });
        }
    });
});
