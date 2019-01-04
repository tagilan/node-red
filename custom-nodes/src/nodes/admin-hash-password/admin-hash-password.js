
module.exports = function(RED){
   
    function generateHash(config){

        RED.nodes.createNode(this,config);

        var node = this;
        
        node.status({});
        
        node.on('input', function(msg) {

            var hash = require('bcryptjs').hashSync(msg.payload, 8)

            if(!msg.payload){
                node.status({
                    fill: "red",
                    shape: "dot",
                    text: "Provide valid password string in payload"
                });
                return false;
            }

            msg.hashedString = hash;

            node.send(msg);
        });

    }

    RED.nodes.registerType("admin-hash-password",generateHash);

}