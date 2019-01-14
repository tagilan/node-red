var should = require("should");
var helper = require("node-red-node-test-helper");
var googlesheets = require("../src/nodes/read-google-sheets/read-google-sheets.js");

helper.init(require.resolve("node-red"));

describe("Read Google Sheets Node Test suit", ()=> {
    beforeEach((done)=> {
      helper.startServer(done);
    });
  
    afterEach((done)=> {
      helper.unload();
      helper.stopServer(done);
    });
  
    //Basic Test to Load the Node
    it("Read Google Sheets Node should be loaded", (done)=> {
      var flow = [{ id: "n1", type: "read-google-sheets", name: "read-google-sheets" }];
  
      helper.load(googlesheets, flow, ()=> {
        var n1 = helper.getNode("n1");
        n1.should.have.property("name", "read-google-sheets");
        done();
      });
      
    });

})