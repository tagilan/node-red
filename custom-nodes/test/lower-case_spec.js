var should = require("should");
var helper = require("node-red-node-test-helper");
//Import the required Node
var lowerNode = require("../src/nodes/lower-case/lower-case.js");

helper.init(require.resolve("node-red"));

describe("lower-case Node Test suit", () => {
  beforeEach((done)=> {
    helper.startServer(done);
  });

  afterEach((done)=> {
    helper.unload();
    helper.stopServer(done);
  });

  it("Node should be loaded", (done) => {
    var flow = [{ id: "n1", type: "lower-case", name: "lower-case" }];

    helper.load(lowerNode, flow, () => {
      var n1 = helper.getNode("n1");
      n1.should.have.property("name", "lower-case");
      done();
    });
  });

  it("Node should make payload lower case", (done) => {
    var flow = [
      { id: "n1", type: "lower-case", name: "lower-case", wires: [["n2"]] },
      { id: "n2", type: "helper" }
    ];
    helper.load(lowerNode, flow, () => {
      var n2 = helper.getNode("n2");
      var n1 = helper.getNode("n1");
      n2.on("input", (msg)=> {
        msg.should.have.property("payload", "uppercase");
        done();
      });
      n1.receive({ payload: "UpperCase" });
    });
  });
});
