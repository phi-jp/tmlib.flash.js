

tm.asset.Loader.register("tmfl", function(path) {
    var data = tm.flash.Data(path);
    
    return data;
});


tm.define("tm.flash.Data", {
    superClass: "tm.event.EventDispatcher",

    init: function(path) {
        this.superInit(path);

        var file = tm.util.File({
            url: path,
            dataType: 'json',
        });

        file.onload = function() {
            this.setData(file.data);
        }.bind(this);

        this.path = path;
    },

    setData: function(data) {
        var self = this;
        var basePath = (function() {
            var arr = self.path.split('/');
            arr.pop();

            return arr.join('/');
        })();

        this.data = data;
        // console.dir(this.data);

        var assets = {};

        if (!this.data.images.length) {
            this.loaded = true;
            this.fire(tm.event.Event("load"));
            return ;
        }

        this.data.images.each(function(path) {
            value = [basePath, path].join('/');
            // var key = value.split('/').last.split('.').first;
            var key = path.split('.').first;
            assets[key] = value;
        });

        var loader = tm.asset.Loader();

        loader.onprocess    = function(e) {
            console.log(e.progress);
        };
        
        loader.onload = function() {
            this.loaded = true;
            this.fire(tm.event.Event("load"));
        }.bind(this);

        loader.load(assets);
    },
});



tm.define("tm.flash.Element", {
    superClass: "tm.display.CanvasElement",
    
    init: function(path, funcs) {
        this.superInit();
        
        this.path = path;
        this.funcs = funcs || {};
        
        var flashData = tm.asset.AssetManager.get(path);
        this.data = flashData.data;

        this.playing = false;
        
        this._setup();
        //this.img_title.x = 300;

        this.onenterframe = function(e) {
            if (this.playing == false) return ;
            this.nextFrame();
        }.bind(this);

        this.gotoAndPlay(0);
    },

    play: function() {
        this.playing = true;
    },

    stop: function() {
        this.playing = false;
    },

    nextFrame: function() {
        // TODO: 
        this.setFrame(this.frame+1);
    },

    prevFrame: function() {
        this.setFrame(this.frame-1);
    },

    gotoAndPlay: function(frame) {
        this.setFrame(frame);
        this.play();
    },

    gotoAndStop: function(frame) {
        this.setFrame(frame);
        this.stop();
    },
    
    setFrame: function(frame) {
        if (this.frame == frame) return ;

        this.frame = frame;

        Object.keys(this.data.layers).each(function(key) {
            var elm = this.getChildByName(key);
            if (!elm) return ;

            var layerData = this.data.layers[key];
            var frameData = layerData.frames[frame];
            if (!frameData) return ;

            // run code
            if (frameData.actionScript) {
                var code = frameData.actionScript.replace('/* js', '').replace('*/', '');
                eval(code);
            }

            // アクティブかどうかをチェック
            if (frameData.active == false) {
                elm.hide();
                return ;
            }
            else {
                elm.show();
            }

            // ベース
            if (frameData.x !== undefined) elm.x = frameData.x;
            if (frameData.y !== undefined) elm.y = frameData.y;
            if (frameData.rotation !== undefined) elm.rotation = frameData.rotation;
            if (frameData.scaleX !== undefined) elm.scaleX = frameData.scaleX;
            if (frameData.scaleY !== undefined) elm.scaleY = frameData.scaleY;

            // テキスト
            if (layerData.type == "text") {
                if (frameData.text !== undefined) elm.text = frameData.text;
                if (frameData.size !== undefined) elm.fontSize = frameData.size;
                if (frameData.face !== undefined) elm.fontFamily = frameData.face;
                if (frameData.fillColor !== undefined) elm.fillStyle = frameData.fillColor;
            }
            else if (layerData.type == "movie clip") {

            }
            // 画像
            else {
                if (frameData.libraryItem !== undefined) {
                    elm.image = frameData.libraryItem.replace(/\.png|\.jpg/, "");
                    elm.width = elm.image.width;
                    elm.height = elm.image.height;
                    elm.show();
                }
                else {
                    elm.hide();
                }
            }
        }.bind(this));
        
        this._checkEvent(frame);

        if (frame >= this.data.frameCount-1) {
            var e = tm.event.Event("finish");
            this.fire(e);
        }
    },

    _setup: function() {

        Object.keys(this.data.layers).each(function(key) {
            var layerData = this.data.layers[key];
            this._dirtyCreate(key, layerData);
        }, this);

        this.setFrame(0);
    },
    
    _checkEvent: function(frame) {
        var func = this.funcs[frame];

        if (func) func();

        // event
        if (!this._eventProps) return ;
        
        var value = this._eventProps[frame];
        
        if (value && value.name) {
            var info = value.name.split(',');
            var func = this.funcs[info[0]];
            
            if (func) {
                info.shift();
                func.apply(this, info);
            }
        }
    },
    
    _dirtyCreate: function(key, layerData) {
        var self = this;

        var elm = null;

        if (layerData.type == "text") {
            elm = tm.display.Label();
            elm.align = "left";
            elm.baseline = "top";
        }
        else if (layerData.type == "movie clip") {
            var frame = null;
            layerData.frames.some(function(elm) {
                if (elm.libraryItem) {
                    frame = elm;
                    return true;
                }
            });
            var dir  = frame.libraryItem;
            var name = frame.libraryItem.split('/').pop();

            var path = dir + '/' + name;
            elm = tm.flash.Element(path, []);

        }
        else {
            elm = tm.display.Sprite();
            elm.hide();
        }

        this.addChildAt(elm, 0);
        elm.name = key;
        elm.origin.set(0, 0);
    },

});


