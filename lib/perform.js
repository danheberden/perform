/*
 * perform.js
 * https://github.com/danheberden/perform
 *
 * Copyright (c) 2012 Dan Heberden
 * Licensed under the MIT license.
 */
(function(){

// Array.slice
var slice = function( arr, index, length ) {
  return [].slice.call( arr, index, length );
};

// represent a future-argument
var Argument = function( num ) {
  this.num = num;
};

// generator to
// add callbacks to a bucked and possible fire them
var stackNFire = function( kind, promisesDfd ) {
  return function() {
    // operate on this unless we forced a deferred to work on
    var dfd = promisesDfd || this;
    var fnSet = [].slice.call( arguments );

    // as long as this is a progress handler or the state isn't reached add it
    // otherwise call it right now
    if ( kind === 'progress' || dfd.state === 'pending' ) {
      dfd[ kind + 's' ].push( fnSet );
    } else {
      callSet.call( dfd, fnSet, this[ kind + 'Args' ] );
    }

    // if we forced a promiseDfd, return the promise
    if ( promisesDfd ) {
      return dfd.promise;
    }
    // otherwise return the root deferred like normal
    return dfd;
  }
};

// call a callback set
var callSet = function( set, args) {

  // nothing to see here folks
  if ( set.length <  1 ) {
    return;
  }

  // the args to call with
  var apply = [];

  // we passed inline arguments
  if ( set.length > 1 ) {
    for ( var i = 1; i < set.length; i++ ) {
      // is it one of those cool perform.arg(X) thingies?
      // if not, just put the passed args in there
      if ( set[i] instanceof Argument ) {
        apply[i] = args[ set[i].num ];
      } else {
        apply[i] = set[i];
      }
      apply = apply.slice(1);
    }
  } else {
    apply = args;
  }

  // actually call the fn with the appropriate args
  set[0].apply( this, apply );
};

// call all the callback sets in a callback bucket
var callSets = function( kind, args ) {
  var bucket = this[ kind + 's' ];
  for ( var i = 0; i < bucket.length; i++ ) {
    callSet.call( this, bucket[i], args );
  }
};

// promise generator - psuedo read-only
var iPromise = function() {
  var dfd = this;
  // since people might be used to .promise()
  var promise = function(){
    return promise;
  };
  promise.done = stackNFire( 'done', dfd );
  promise.fail = stackNFire( 'fail', dfd );
  promise.progress = stackNFire( 'progress', dfd );
  promise.state = dfd.state;
  return promise;
};

// pass judgement onto thy deferred
var judge = function( kind ) {
  return function() {
    if ( this.state === 'pending' ) {
      if ( kind !== 'progress' ) {
        this[ kind + 'Args' ] = arguments;
        this.state = this.promise.state = kind;
      }
      callSets.call( this, kind, arguments );
    }
    return this;
  }
};

// the heart of the beast
var Deferred = function() {
  this.dones = [];
  this.doneArgs = [];
  this.fails = [];
  this.failArgs = [];
  this.pendings = [];
  this.pendingArgs = [];
  this.state = 'pending';

  // expose the promise
  this.promise = iPromise.call( this );

};
Deferred.prototype = {
  resolve: judge( 'done' ),
  reject: judge( 'fail' ),
  notify: judge( 'pending' ),
  done: stackNFire('done'),
  fail: stackNFire('fail'),
  progress: stackNFire( "pending" ),
  promise: iPromise()
};

var Perform = function( args ){
  this.state = {
    doneCount: 0,
    failCount: 0
  };
  this.sets = [ args ];
  this.args = [];
  this.deferreds = [];
}
var checkPerform = function( performer ) {
  if ( performer.state.doneCount === 0 && performer.state.failCount === 0 ) {
    var args = [];
    for ( var i = 0; i < performer.args.length; i++ ) {
      args = args.concat( performer.args[i].args );
    }
    callSets.call( performer, 'set', args );
  }
};
var whenUnless = function( type ) {
  return function() {
    var performer = this;
    var dfds = arguments;
    for ( var i = 0; i < dfds.length; i++ ) {
      var dfd = dfds[i];
      if ( dfd instanceof Deferred ) {
        var arg = {};
        performer.deferreds.push( dfd );
        performer.args.push( arg );
        performer.state[ type + 'Count' ]++;
        dfd[type]( function() {
          arg.args = slice( arguments );
          performer.state[ type + 'Count' ]--;
          checkPerform( performer );
        });
      }
    }
    return this;
  };
};
Perform.prototype = {
  when: whenUnless( 'done' ),
  unless: whenUnless( 'fail' ),
  and: function() {
    this.sets.push( slice( arguments ) );
  }
};

// make a callback or callback-set observable
var perform = function() {
  return new Perform( [].slice.call( arguments ) );
};

// make an Argument object to quick-hand reference args
perform.argument = function( num ){
  return new Argument( num );
};
// short alias
perform.arg = perform.argument;

// expose Deferred creation
perform.Deferred = function() {
  return new Deferred();
};
// clever shortcut
perform.er = perform.Deferred;

// expose module (module.exports) or window
if ( typeof module !== "undefined" && module.exports ) {
  module.exports = perform;
} else {
  this.perform = perform;
}

}());
