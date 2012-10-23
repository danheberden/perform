# perform

A sensible deferred library

## A current work in progress, so don't use this yet

```javascript

// for the sake of example, a simple log funtion
var log = function( x ) { console.log( x ); };

// so you have a deffered just like normal
var dfdA = perform.er();
dfdA.done( log, 'Yay! The deferred resolved!' );
dfdA.fail( log, 'Uh oh, it failed :(' );

// and this one
var dfdB = perform.er();
dfdB.done( log, 'B is so cool!' );
dfdB.fail( log, 'whatever....' );

// and now the reveal
perform( log, 'All done bitches' )
  .when( dfdA )
  .unless( dfdB );

dfdA.resolve();
dfdB.reject();

// CONSOLE:
// => Yay! The deferred resolved!
// => whatever...
// => All done bitches
```

As for arguments, you can still do a function like normal:

```javascript
var dfdA = perform.er();
dfdA.done( function( arg1 ) {
  console.log( arg1 );
});
dfdA.resolve( 'hi there' );

// CONSOLE:
// => hi there
```

Or specify stuff inline like this:

```javascript

var doSomething = function( x, y ) {
  console.log( x * y );
};
var dfdA = perform.er();
dfdA.done( doSomething, 5, perform.arg(0) );
dfdA.resolve( 20 );

// CONSOLE:
// => 100
```

Tasking is now easy

```javascript
var taskA = perform( anAsyncTask ).when( someAsyncTask );
var taskB = perform( anotherAsyncTask ).when( taskA );
var taskC = perform( log, "ALL DONE" ).when( taskB );
```

## Getting Started
Install the module with: `npm install perform`

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/gruntjs/grunt).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2012 Dan Heberden  
Licensed under the MIT license.
