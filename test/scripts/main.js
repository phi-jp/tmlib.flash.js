
window.FRAME = 0;


tm.main(function() {
    var app = tm.display.CanvasApp("#world");
    app.background = "#aaa";
    
    app.fitWindow();
    
    var loading = tm.app.LoadingScene({
        assets: {
            "sample": "flash/sample/sample.tmfl",
        },
        nextScene: MainScene,
    });
    
    app.replaceScene(loading);
    
    app.run();
    
    var gui = app.enableDatGUI();
    gui.add(window, "FRAME", 0, 30).step(1).listen().onChange(function() {
        app.currentScene.flashElement.gotoAndStop(window.FRAME);
    });

    window.app = app;
});


tm.define("MainScene", {
    superClass: "tm.app.Scene",
    
    init: function() {
        this.superInit();
        
        var elm = tm.flash.Element("sample", {
        }).addChildTo(this);
        
        this.flashElement = elm;
    },
    
    update: function() {
        return ;
        var func = this.funcs[this.index];
        
        if (func) func.bind(this)();
        
        this.index++;
//        this.index = this.index % 30;
        
        if (this.index >= 37) this.index = 36;
    },
});



