// Generated by CoffeeScript 1.3.3
(function() {
  var Phantom, Sync, express, fs, path, should, temp, test, _ref;

  should = require('should');

  _ref = require('../../lib/phantom-sync'), Phantom = _ref.Phantom, Sync = _ref.Sync;

  express = require('express');

  temp = require('temp');

  path = require('path');

  fs = require('fs');

  test = function(options) {
    var app, p, page, phantom, _ref1;
    _ref1 = [], app = _ref1.app, phantom = _ref1.phantom, p = _ref1.p, page = _ref1.page;
    before(function(done) {
      app = express.createServer();
      app.get('/', function(req, res) {
        return res.send("<html>\n  <head>\n    <title>Test page title</title>\n    <script src=\"https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js\"></script>\n  </head>\n  <body>\n    <div id=\"somediv\">\n      <div class=\"anotherdiv\">Some page content</div>\n    </div>\n    <button class=\"clickme\" style=\"position: absolute; top: 123px; left: 123px; width: 20px; height; 20px\" onclick=\"window.i_got_clicked = true;\" />\n  </body>\n</html>");
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
    describe("opening page", function() {
      it("creating", function(done) {
        return Sync(function() {
          p = phantom.create();
          page = p.createPage();
          return done();
        });
      });
      it("visiting", function(done) {
        return Sync(function() {
          var status;
          status = page.open("http://127.0.0.1:" + (app.address().port) + "/");
          status.should.be.ok;
          return done();
        });
      });
      return it("title is correct", function(done) {
        return Sync(function() {
          var title;
          title = page.evaluate(function() {
            return document.title;
          });
          title.should.equal("Test page title");
          return done();
        });
      });
    });
    return describe("within the page", function() {
      it("can inject Javascript from a file", function(done) {
        return Sync(function() {
          var success;
          success = page.injectJs('test/inject.js');
          success.should.be.ok;
          return done();
        });
      });
      it("evaluating DOM nodes", function(done) {
        return Sync(function() {
          var node;
          node = page.evaluate((function() {
            return document.getElementById('somediv');
          }));
          node.tagName.should.be.equal('DIV');
          node.id.should.be.equal('somediv');
          return done();
        });
      });
      it("evaluating scripts defined in the header", function(done) {
        return Sync(function() {
          var html;
          html = page.evaluate(function() {
            return $('#somediv').html();
          });
          html = html.replace(/\s\s+/g, "");
          html.should.equal('<div class="anotherdiv">Some page content</div>');
          return done();
        });
      });
      it("setting a nested property", function(done) {
        return Sync(function() {
          var oldVal, val;
          oldVal = page.set('settings.loadPlugins', true);
          val = page.get('settings.loadPlugins');
          oldVal.should.equal(val);
          return done();
        });
      });
      it("simulating clicks on page locations", function(done) {
        return Sync(function() {
          var clicked;
          page.sendEvent('click', 133, 133);
          clicked = page.evaluate(function() {
            return window.i_got_clicked;
          });
          clicked.should.be.ok;
          return done();
        });
      });
      it("registering an onConsoleMessage handler", function(done) {
        return Sync(function() {
          var msg;
          msg = null;
          page.set('onConsoleMessage', function(_msg) {
            return msg = _msg;
          });
          page.evaluate(function() {
            return console.log("Hello, world!");
          });
          msg.should.equal("Hello, world!");
          return done();
        });
      });
      return it("rendering the page to a file", function(done) {
        return Sync(function() {
          var fileName;
          fileName = temp.path({
            suffix: '.png'
          });
          page.render(fileName);
          path.existsSync(fileName).should.be.ok;
          fs.unlink(fileName);
          return done();
        });
      });
    });
  };

  describe("phantom-sync", function() {
    return describe("sync", function() {
      return describe("page", function() {
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
