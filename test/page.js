// Generated by CoffeeScript 1.6.3
(function() {
  var express, fs, path, phantom, should, sync, temp, _ref;

  should = require('should');

  _ref = require('../lib/phantom-sync'), phantom = _ref.phantom, sync = _ref.sync;

  express = require('express');

  temp = require('temp');

  path = require('path');

  fs = require('fs');

  describe("phantom-sync", function() {
    return describe("sync", function() {
      return describe("page", function() {
        var app, page, ph, server, _ref1;
        _ref1 = {}, app = _ref1.app, server = _ref1.server, ph = _ref1.ph, page = _ref1.page;
        before(function(done) {
          app = express();
          app.get('/', function(req, res) {
            return res.send("<html>\n  <head>\n    <title>Test page title</title>\n    <script src=\"https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js\"></script>\n  </head>\n  <body>\n    <div id=\"somediv\">\n      <div class=\"anotherdiv\">Some page content</div>\n    </div>\n    <button class=\"clickme\" style=\"position: absolute; top: 123px; left: 123px; width: 20px; height; 20px\" onclick=\"window.i_got_clicked = true;\" />\n  </body>\n</html>");
          });
          server = app.listen();
          return done();
        });
        after(function(done) {
          return sync(function() {
            if (ph != null) {
              ph.exitAndWait(500);
            }
            if (server != null) {
              server.close();
            }
            return done();
          });
        });
        describe("opening page", function() {
          it("creating", function(done) {
            return sync(function() {
              ph = phantom.create();
              page = ph.createPage();
              return done();
            });
          });
          it("visiting", function(done) {
            return sync(function() {
              var status;
              status = page.open("http://127.0.0.1:" + (server.address().port) + "/");
              status.should.be.ok;
              return done();
            });
          });
          return it("title is correct", function(done) {
            return sync(function() {
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
            return sync(function() {
              var success;
              success = page.injectJs('test/inject.js');
              success.should.be.ok;
              return done();
            });
          });
          it("evaluating DOM nodes", function(done) {
            return sync(function() {
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
            return sync(function() {
              var html;
              html = page.evaluate(function() {
                return $('#somediv').html();
              });
              html = html.replace(/\s\s+/g, "");
              html.should.equal('<div class="anotherdiv">Some page content</div>');
              return done();
            });
          });
          it("script taking one parameter", function(done) {
            return sync(function() {
              var res;
              res = page.evaluate((function(p1) {
                return "res:" + p1;
              }), 'p12345');
              res.should.equal("res:p12345");
              return done();
            });
          });
          it("script taking two parameters", function(done) {
            return sync(function() {
              var res;
              res = page.evaluate((function(p1, p2) {
                return "res:" + p1 + " " + p2;
              }), 'p12345', 678);
              res.should.equal("res:p12345 678");
              return done();
            });
          });
          it("setting a nested property", function(done) {
            return sync(function() {
              var oldVal, val;
              oldVal = page.set('settings.loadPlugins', true);
              val = page.get('settings.loadPlugins');
              oldVal.should.equal(val);
              return done();
            });
          });
          return it("rendering the page to a file", function(done) {
            return sync(function() {
              var fileName;
              fileName = temp.path({
                suffix: '.png'
              });
              page.render(fileName);
              fs.existsSync(fileName).should.be.ok;
              fs.unlink(fileName);
              return done();
            });
          });
        });
      });
    });
  });

}).call(this);
