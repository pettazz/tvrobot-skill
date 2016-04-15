require('alexa-app-server').start({
    port: 8008,
    app_dir: "../",
    debug: true,
    log: true,
    preRequest: function(json,req,res) {},
    postRequest: function(json,req,res) {}
});
