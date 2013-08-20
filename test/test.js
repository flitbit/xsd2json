'use strict';

var expect = require('expect.js'),
	converter = require('../lib/converter');

describe("XSD to JSON schema converter", function() {

	it('public methods are exposed', function() {
		expect(converter).to.have.property('convertToJsonSchema');
	});

	it('#getJSON with null xsd returns empty JSON', function() {
		converter.convertToJsonSchema(null, function(err, data){
			expect(data).to.be.empty();
		});
	});

	it('#getJSON with invalid xsd throws SyntaxError', function() {
		expect(function() { converter.convertToJsonSchema('test'); }).to.throwException();
	});
});
