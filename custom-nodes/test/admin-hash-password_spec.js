var should = require("should");
var helper = require("node-red-node-test-helper");
var hashNode = require("../src/nodes/admin-hash-password/admin-hash-password.js");

helper.init(require.resolve("node-red"));

//Test Suite
describe("Hash password Node test suit", () => {
 
  beforeEach(done => {
    helper.startServer(done);
  });

  afterEach(done => {
    helper.unload();
    helper.stopServer(done);
  });

  //#Test case 1
  it("#admin-hash-password Node should be loaded", done => {
    var flow = [
      { id: "n1", type: "admin-hash-password", name: "admin-hash-password" }
    ];

    helper.load(hashNode, flow, () => {
      var n1 = helper.getNode("n1");
      n1.should.have.property("name", "admin-hash-password");
      done();
    });

  });

  //#Test case 2
  it("#admin-hash-password Node should accept payload", done => {
    var flow = [
      {
        id: "n1",
        type: "admin-hash-password",
        name: "admin-hash-password",
        wires: [["n2"]]
      },
      {
        id: "n2",
        type: "helper",
        name: "helper-node"
      }
    ];

    helper.load(hashNode, flow, () => {
    
      var n1 = helper.getNode("n1");
      var n2 = helper.getNode("n2");

      n2.on("input", msg => {
        msg.should.have.property("payload", "pa55W0rD");
        msg.should.have.property("hashedString");
        done();
      });

      n1.receive({ payload: "pa55W0rD" });
      
    });
  });
});
