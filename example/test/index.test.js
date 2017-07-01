'use strict';

var Proto = require('Proto');
var should = require('should');

var User = Proto({
	name:'guest',
	constructor:function(name) {
		this.name = typeof name === 'string' ? name : this.name;
	}
});

describe('Checking if the user is created correctly', function() {
	it('should create the user with the correct name', function() {
		var user = new User('Tester');
		user.name.should.be.equal('Tester');
	});
});
