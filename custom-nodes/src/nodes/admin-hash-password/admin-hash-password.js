
module.exports = function(RED){
   
    function generateHash(config){

        RED.nodes.createNode(this,config);

        var node = this;
        
        node.status({});
        
        node.on('input', function(msg) {

            var hash = require('bcryptjs').hashSync(config.password, 8)

            if(!config.password){
                node.status({
                    fill: "red",
                    shape: "dot",
                    text: "Provide valid Password String"
                });
                return false;
            }

            msg.passwordString = config.password;

            msg.hashedString = hash;

            node.send(msg);
        });

    }

    RED.nodes.registerType("admin-hash-password",generateHash);

}