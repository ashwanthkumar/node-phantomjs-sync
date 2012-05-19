// Generated by CoffeeScript 1.3.3
(function() {
  var Phantom, Sync, express, should, test, _ref;

  should = require('should');

  express = require('express');

  _ref = require('../../lib/phantom-sync'), Phantom = _ref.Phantom, Sync = _ref.Sync;

  test = function(options) {
    var app, p, page, phantom, _ref1;
    _ref1 = [], app = _ref1.app, phantom = _ref1.phantom, p = _ref1.p, page = _ref1.page;
    before(function(done) {
      app = express.createServer();
      app.use(express["static"](__dirname));
      app.get('/', function(req, res) {
        return res.send("<html>\n  <head>\n    <title>Test page title</title>\n  </head>\n  <body>\n    <img src=\"/test.gif\" />\n  </body>\n</html>");
      });
      app.listen();
      phantom = new Phantom(options);
      return done();
    });
    after(function(done) {
      if (p != null) {
        p.exit();
      }
      if (app != null) {
        app.close();
      }
      return done();
    });
    return describe("phantom  instance with --load-images=no", function() {
      it("opening  a page", function(done) {
        return Sync(function() {
          var status;
          p = phantom.create('--load-images=no');
          page = p.createPage();
          status = page.open("http://127.0.0.1:" + (app.address().port) + "/");
          status.should.be.ok;
          return done();
        });
      });
      it("checking that loadImages is not set", function(done) {
        return Sync(function() {
          var s;
          s = page.get('settings');
          s.loadImages.should.be["false"];
          return done();
        });
      });
      return it("checking a test image", function(done) {
        return Sync(function() {
          var img;
          img = page.evaluate(function() {
            return document.getElementsByTagName('img')[0];
          });
          img.width.should.equal(0);
          img.height.should.equal(0);
          return done();
        });
      });
    });
  };

  describe("phantom-sync", function() {
    return describe("sync", function() {
      return describe("adv", function() {
        var mode, _i, _len, _ref1, _results;
        _ref1 = [void 0, 'sync', ['mixed', 'args'], ['mixed', 'fibers']];
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          mode = _ref1[_i];
          _results.push(describe("" + mode + " mode", function() {
            return test({
              mode: mode
            });
          }));
        }
        return _results;
      });
    });
  });

}).call(this);
