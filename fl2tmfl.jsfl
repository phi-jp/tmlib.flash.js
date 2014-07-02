/*
 *
 */

function importScript(file) {
    var path = fl.scriptURI.substr( 0 , fl.scriptURI.lastIndexOf("/") + 1 );
    fl.runScript( path + file );
};


importScript("jsfl/libs/json2.js");
importScript("jsfl/libs/base64.js");

importScript("jsfl/util.jsfl");
importScript("jsfl/image.jsfl");
importScript("jsfl/timeline.jsfl");


var main = function() {
    fl.trace("/// Start!!");
    
    var folderName = _doc.name.split(".")[0];
    
    var path = _currentFonderURI + "/" + folderName;
    
    exportFlash(path);
    
    fl.trace("/// Finish!!");
};

main();






