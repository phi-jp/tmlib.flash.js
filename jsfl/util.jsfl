

var _doc = fl.getDocumentDOM();
var _lib = _doc.library;
var _currentFonderURI = (function() {
    var path = _doc.pathURI.replace('/' + _doc.name, '');
    return path;
})();


/*
 * アイテムタイプごとのプレフィックスを取得
 */
var getItemPrefix = function(item) {
    return item.itemType.substr(0, 1);
};


/*
 * ファイルを出力
 */
var writeFile = function(path, txt) {
    if (FLfile.write(path, txt)) {
//        fl.trace('[success file]');
    }
};


var print = function(obj) {
    for (var key in obj) {
        if (/brightness|tintColor|tintPercent/.test(key) == false)
            fl.trace([key, obj[key]].join(' : '));
    }
}