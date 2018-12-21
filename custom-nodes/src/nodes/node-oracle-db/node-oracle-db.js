 var oracledb = require('oracledb');

 module.exports = function (RED) {

     function OracleDB(config) {

         RED.nodes.createNode(this, config);
         var node = this;
         node.status({});

         node.on('input', function (msg) {
             if (!msg.payload.query) {
                 node.error("Input Query Missing in Payload");
                 node.status({
                     fill: "red",
                     shape: "dot",
                     text: "Input Query Missing in Payload"
                 });
                 return false;
             }

             if (!config.user || !config.password || !config.connect) {
                 node.error(" Node Input Missing");
                 node.status({
                     fill: "red",
                     shape: "dot",
                     text: "Node Input Missing"
                 });
                 return false;
             }

             oracledb.getConnection({
                     user: config.user,
                     password: config.password,
                     connectString: config.connect
                 },
                 function (err, connection) {
                     if (err) {
                         console.error(err);
                         return;
                     }
                     node.status({
                         fill: "green",
                         shape: "dot",
                         text: "connected"
                     });

                     var options = {
                         autoCommit: true
                     }

                     connection.execute(
                         msg.payload.query, [],
                         options,
                         function (err, result) {
                             if (err) {
                                 doRelease(connection);
                                 console.log(err);
                                 return;
                             }
                             var records = result.rows;
                             msg.responsedata = records ? records : null;
                             msg.result = result;
                             node.send(msg);
                             doRelease(connection);
                         });
                 });
         });


         function doRelease(connection) {
             connection.close(
                 function (err) {
                     if (err)
                         console.error(err.message);
                 });
         }
     }

     RED.nodes.registerType("oracle-db", OracleDB);
 }