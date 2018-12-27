var should = require("should");
var helper = require("node-red-node-test-helper");
var oracledb = require("../src/nodes/node-oracle-db/node-oracle-db.js");
helper.init(require.resolve("node-red"));

describe("node-oracle-db Test suit", function() {
    beforeEach(function(done) {
      helper.startServer(done);
    });
  
    afterEach(function(done) {
      helper.unload();
      helper.stopServer(done);
    });
  
    //Basic Test to Load the Node
    it("Node should be loaded", function(done) {
      var flow = [{ id: "n1", type: "oracle-db", name: "oracle-db" }];
  
      helper.load(oracledb, flow, function() {
        var n1 = helper.getNode("n1");
        n1.should.have.property("name", "oracle-db");
        done();
      });
      
    });

})