
// ajax
App.Com.ajax({
  type:  'GET',
  url:   '/assets/tests/ajax-test.json',
  success: function (data) {
    test( "ajax get 200", function() {
      ok( true, "File found!" );
      equal( data.success, true, "content parsable and ok!" );
      equal( data.success2, undefined, "content parsable and ok!" );
    });
  },
  error: function (data) {
    test( "ajax", function() {
      ok( false, "Failed!" );
    });
  }
});

// ajax queueing
App.Com.ajax({
  type:  'GET',
  url:   '/test/wait/2',
  queue: true,
  success: function (data) {
    test( "ajax - queue - ajax get 200 1/2", function() {

      // check queue
      ok( !window.testAjax, 'ajax - queue - check queue' );
      window.testAjax = true;
      equal( data.success, true, "ajax - queue - content parsable and ok!" );
      equal( data.success2, undefined, "ajax - queue - content parsable and ok!" );
    });
  },
  error: function (data) {
    test( "ajax", function() {
      ok( false, "Failed!" );
    });
  }
});
App.Com.ajax({
  type:  'GET',
  url:   '/test/wait/1',
  queue: true,
  success: function (data) {
    test( "ajax - queue - ajax get 200 2/2", function() {
      // check queue
      ok( window.testAjax, 'ajax - queue - check queue' )
      window.testAjax = undefined;

      equal( data.success, true, "content parsable and ok!" );
      equal( data.success2, undefined, "content parsable and ok!" );
    });
  },
  error: function (data) {
    test( "ajax", function() {
      ok( false, "Failed!" );
    });
  }
});

// ajax parallel
App.Com.ajax({
  type:  'GET',
  url:   '/test/wait/2',
  success: function (data) {
    test( "ajax - parallel - ajax get 200 1/2", function() {

      // check queue
      ok( window.testAjaxQ, 'ajax - parallel - check queue' );
      window.testAjaxQ = undefined;
      equal( data.success, true, "ajax - parallel - content parsable and ok!" );
      equal( data.success2, undefined, "ajax - parallel - content parsable and ok!" );
    });
  },
  error: function (data) {
    test( "ajax", function() {
      ok( false, "Failed!" );
    });
  }
});
App.Com.ajax({
  type:  'GET',
  url:   '/test/wait/1',
  success: function (data) {
    test( "ajax - parallel - ajax get 200 2/2", function() {
      // check queue
      ok( !window.testAjaxQ, 'ajax - parallel - check queue' )
      window.testAjaxQ = true;

      equal( data.success, true, "content parsable and ok!" );
      equal( data.success2, undefined, "content parsable and ok!" );
    });
  },
  error: function (data) {
    test( "ajax", function() {
      ok( false, "Failed!" );
    });
  }
});


// i18n
test( "i18n", function() {

  // de
  App.i18n.set('de');
  var translated = App.i18n.translateContent('yes');
  equal( translated, 'ja', 'de - yes / ja translated correctly' );

  translated = App.i18n.translateContent('<test&now>//*äöüß');
  equal( translated, '&lt;test&amp;now&gt;//*äöüß', 'de - <test&now>//*äöüß' );

  var timestamp = App.i18n.translateTimestamp('2012-11-06T21:07:24Z');
  equal( timestamp, '06.11.2012 22:07', 'de - timestamp translated correctly' );

  // en
  App.i18n.set('en');
  translated = App.i18n.translateContent('yes');
  equal( translated, 'yes', 'en - yes translated correctly' );

  translated = App.i18n.translateContent('<test&now>');
  equal( translated, '&lt;test&amp;now&gt;', 'en - <test&now>' );

  timestamp = App.i18n.translateTimestamp('2012-11-06T21:07:24Z');
  equal( timestamp, '2012-11-06 22:07', 'en - timestamp translated correctly' );
});

// events
test( "events simple", function() {

  // single bind
  App.Event.bind( 'test1', function(data) {
    ok( true, 'event received - single bind');
    equal( data.success, true, 'event received - data ok - single bind');
  });
  App.Event.bind( 'test2', function(data) {
    ok( false, 'should not be triggered - single bind');
  });
  App.Event.trigger( 'test1', { success: true } );

  App.Event.unbind( 'test1')
  App.Event.bind( 'test1', function(data) {
    ok( false, 'should not be triggered - single bind');
  });
  App.Event.unbind( 'test1');
  App.Event.trigger( 'test1', { success: true } );

  // multi bind
  App.Event.bind( 'test1-1 test1-2', function(data) {
    ok( true, 'event received - multi bind');
    equal( data.success, true, 'event received - data ok - multi bind');
  });
  App.Event.bind( 'test1-3', function(data) {
    ok( false, 'should not be triggered - multi bind');
  });
  App.Event.trigger( 'test1-2', { success: true } );

  App.Event.unbind( 'test1-1')
  App.Event.bind( 'test1-1', function(data) {
    ok( false, 'should not be triggered - multi bind');
  });
  App.Event.trigger( 'test1-2', { success: true } );
});

test( "events level", function() {

  // bind with level
  App.Event.bind( 'test3', function(data) {
    ok( false, 'should not be triggered!');
  }, 'test-level' );

  // unbind with level
  App.Event.unbindLevel( 'test-level' );

  // bind with level
  App.Event.bind( 'test3', function(data) {
    ok( true, 'event received');
    equal( data.success, true, 'event received - data ok - level bind');
  }, 'test-level' );
  App.Event.trigger( 'test3', { success: true} );

});

// local store
test( "local store", function() {

  var tests = [
    'some 123äöüßadajsdaiosjdiaoidj',
    { key: 123 },
    { key1: { key1: [1,2,3,4] }, key2: [1,2,'äöüß'] },
  ];

  // write/get
  App.Store.clear()
  _.each(tests, function(test) {
    App.Store.write( 'test1', test );
    var item = App.Store.get( 'test1' );
    deepEqual( test, item, 'write/get - compare stored and actual data' )
  });

  // undefined/get
  App.Store.clear()
  _.each(tests, function(test) {
    var item = App.Store.get( 'test1' );
    deepEqual( undefined, item, 'undefined/get - compare not existing data and actual data' )
  });

  // write/get/delete
  var tests = [
    { key: 'test1', value: 'some 123äöüßadajsdaiosjdiaoidj' },
    { key: 123, value: { a: 123, b: 'sdaad' } },
    { key: '123äöüß', value: { key1: [1,2,3,4] }, key2: [1,2,'äöüß'] },
  ];

  App.Store.clear()
  _.each(tests, function(test) {
    App.Store.write( test.key, test.value );
  });

  _.each(tests, function(test) {
    var item = App.Store.get( test.key );
    deepEqual( test.value, item, 'write/get/delete - compare stored and actual data' );
    App.Store.delete( test.key );
    item = App.Store.get( test.key );
    deepEqual( undefined, item, 'write/get/delete - compare deleted data' );
  });

});

// config
test( "config", function() {

  // simple
  var tests = [
    { key: 'test1', value: 'some 123äöüßadajsdaiosjdiaoidj' },
    { key: 123, value: { a: 123, b: 'sdaad' } },
    { key: '123äöüß', value: { key1: [1,2,3,4] }, key2: [1,2,'äöüß'] },
  ];

  _.each(tests, function(test) {
    App.Config.set( test.key, test.value )
  });

  _.each(tests, function(test) {
    var item = App.Config.get( test.key )
    deepEqual( item, test.value, 'set/get tests' );
  });

  // group
  var test_groups = [
    { key: 'test2', value: [ 'some 123äöüßadajsdaiosjdiaoidj' ] },
    { key: 1234, value: { a: 123, b: 'sdaad' } },
    { key: '123äöüß', value: { key1: [1,2,3,4,5,6] }, key2: [1,2,'äöüß'] },
  ];
  var group = {};
  _.each(test_groups, function(test) {
    App.Config.set( test.key, test.value, 'group1' );
    group[test.key] = test.value
  });

  // verify whole group
  var item = App.Config.get( 'group1' );
  deepEqual( item, group, 'group - verify group hash');

  // verify each setting
  _.each(test_groups, function(test) {
    var item = App.Config.get( test.key, 'group1' );
    deepEqual( item, test.value, 'group set/get tests' );
  });
});


// auth
App.Auth.login({
  data: {
    username: 'not_existing',
    password: 'not_existing'
  },
  success: function(data) {
    test( "auth - not existing user", function() {
      ok( false, 'ok')
    })
  },
  error: function() {
    test( "auth - not existing user", function() {
      ok( true, 'ok')
      authWithSession();
    })
  }
});

var authWithSession = function() {
  App.Auth.login({
    data: {
      username: 'nicole.braun@zammad.org',
      password: 'test'
    },
    success: function(data) {
      test( "auth - existing user", function() {
        ok( true, 'authenticated')
        var user = App.Session.get('login');
        equal( 'nicole.braun@zammad.org', user, 'session login')
      })
    },
    error: function() {
      test( "auth - existing user", function() {
        ok( false, 'not authenticated')
      })
    }
  });
}