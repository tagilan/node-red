 echo 'Starting custom-nodes npm install..'

    cd ../custom-nodes
    npm install

    if [ $? -eq 0 ]; then
        echo 'Linking custom-nodes with Node-RED..'
        npm link
        cd ..
        npm link custom-nodes
        echo 'FINISHED'
    else
        echo 'custom-nodes npm install failed.'
    fi

echo 'Finished Linking custom nodes'