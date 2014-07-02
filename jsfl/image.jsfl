
/*
 * ライブラリを全て画像化して出力
 */
var exportImages = function(path) {
    // フォルダを作成
    FLfile.createFolder(path);

    // 画像出力
    var itemArray = fl.getDocumentDOM().library.items;
    for (var i=0; i<itemArray.length; ++i) {
        var item = itemArray[i];
        exportImage(item, path);
    }
};

/*
 * 画像を出力
 */
var exportImage = function(item, dir) {
    var name = item.name;
    var finalPath = "";

    if (item.itemType == 'bitmap') {

        if (name.indexOf('.') == -1) {
            name += ".png";
            // if(name.indexOf('.') == -1){
            //     ext = (item.originalCompressionType == 'photo') ? '.jpg' : '.png';
            // }
        }
        
        finalPath = dir + '/' + name;
        item.exportToFile(finalPath);
    }
    else if (item.itemType == "graphic"){
        finalPath = dir + '/' + name + ".png";
        item.exportToPNGSequence(finalPath, 0, 1);
    }
};

