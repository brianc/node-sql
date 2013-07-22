.PHONY: jshint test

jshint:
	./node_modules/.bin/jshint lib test

test:
	npm test
