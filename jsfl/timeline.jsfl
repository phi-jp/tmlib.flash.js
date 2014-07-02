

var exportFlash = function(path) {
    // scene0 を編集
    _doc.editScene(0);

    // 画像を出力
    exportImages(path);

    // タイムラインを出力
    var tl  = _doc.getTimeline();
    var name = _doc.name.replace(/\.fla$/, '.tmfl');
    exportTimeline(tl, name, path, true);

    document.revert();
};


var exportTimeline = function(tl, name, path, rootFlag) {
    // フォルダを作成
    FLfile.createFolder(path);

    // レイヤー
    var layersData = {};
    tl.layers.forEach(function(layer) {
        var type = getLayerType(layer);

        layersData[layer.name] = {
            type: type,
            frames: []
        };
    }, this);

    // タイムラインから値を取得
    for (var i=0; i<tl.frameCount; ++i) {
        var props = exportLayerFrame(tl, i);
        for (var key in layersData) {
            layersData[key].frames.push(props[key]);
        }
    }

    tl.currentFrame = 0;

    // 重複削除
    /*
    for (var key in layersData) {
        var frames = layersData[key].frames;

        frames.forEach(function(prop, index) {
            index = this.length-index-1;
            if (index == 0) return ;

            var prev = frames[index-1];
            var now = frames[index];

            for (var key in prev) {
                if (now[key] === prev[key]) {
                    delete now[key];
                }
            }
        }, frames);
    }
    */

    // 画像リスト
    var images = (function() {
        var arr = [];
        var itemArray = fl.getDocumentDOM().library.items;

        if (rootFlag == false) return arr;

        for (var i=0; i<itemArray.length; ++i) {
            var item = itemArray[i];
            if (item.itemType == "bitmap") {
                arr.push(item.name);
            }
            else if (item.itemType == "movie clip") {
                var name = item.name.split('/').pop();
                var filename = name + '.tmfl';
                var subPath = [path, item.name].join('/');
                exportTimeline(item.timeline, filename, subPath, false);

                arr.push(item.name + '/' + filename);
            }
            else if (item.itemType == "graphic") {
                arr.push(item.name + ".png");
            }
            else {
//                fl.trace(item.name);
            }
        }

        return arr;
    })();


    var path = [path, name].join('/');
    var finalData = {
        frameCount: tl.frameCount,
        layers: layersData,
        images: images,
    };
//    var str = JSON.stringify( finalData, null, 4 );
    var str = JSON.stringify( finalData　);

    writeFile(path, str);
};

var getLayerType = function(layer) {
    var elm = null;

    for (var i=0,len=layer.frames.length; i<len; ++i) {
        var frame = layer.frames[i];

        if (frame) {
            elm = frame.elements[0];
            if (elm) break;
        }
    }

    var type = elm ? elm.elementType : "";

    if (elm && elm.libraryItem) {
        type = elm.libraryItem.itemType;
    }

    return type;
};

/*
 * index フレームのレイヤーを出力
 */
var exportLayerFrame = function(tl, index) {
    var obj = {};

    tl.currentFrame = index;
    // tl.setSelectedFrames(index, index);

    tl.layers.forEach(function(layer) {
        var frame = layer.frames[index];
        if (!frame) {
            obj[layer.name] = {
                active: false,
            };
            return ;
        }

        frame.convertToFrameByFrameAnimation();

        var elm = frame.elements[0];
        if (!elm) {
            obj[layer.name] = {
                active: false,
                actionScript: frame.actionScript,
            };

            if (frame.actionScript) {
                obj[layer.name]["actionScript"] = frame.actionScript;
            }
            return ;
        }
        
        var prop = obj[layer.name] = {
            active: true,
            x: elm.x,
            y: elm.y,
            rotation: elm.rotation,
            scaleX: elm.scaleX,
            scaleY: elm.scaleY,
            actionScript: frame.actionScript,
        };
        
        if (elm.elementType == "text") {
            var text = elm.getTextString();
            
            prop.text = text;
            prop.fillColor = elm.getTextAttr("fillColor");
            prop.size = elm.getTextAttr("size");
            prop.face = elm.getTextAttr("face");
        }
        
        if (elm.libraryItem) {
            prop.libraryItem = elm.libraryItem.name;
        }
    }, this);

    return obj;
};
