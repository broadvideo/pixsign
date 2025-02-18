
/* Int: Current logging level */
var LOG_LEVEL;

/* String: Client Version */
var VERSION = "1.6.0";

/* Int: Counter to ensure unique IDs */
var ID_COUNTER = 0;

var PRELOAD;

function dsInit(layoutid) {
    LOG_LEVEL = 10;

    /* Hide the info and log divs */
    $("#log").css("display", "block");
    $("#info").css("display", "none");
    $("#end").css("display", "none");

    /* Setup a keypress handler for local commands */
    document.onkeypress = keyHandler;

    playLog(0, "info", "HTML Preview v" + VERSION + " Starting Up", true);
    
    PRELOAD = html5Preloader();
    runningLayout = new layout(layoutid);
}

/* Generate a unique ID for region DIVs, media nodes etc */
function nextId() {
    if (ID_COUNTER > 500) {
        ID_COUNTER = 0;
    }
    
    ID_COUNTER = ID_COUNTER + 1;
    return ID_COUNTER;
}

/* OnScreen Log */
function playLog(logLevel, logClass, logMessage, logToScreen) {
    if (logLevel <= LOG_LEVEL)
    {
        var msg = timestamp() + " " + logClass.toUpperCase() + ": " + logMessage;
        console.log(msg);
        
        if (logToScreen) {
            //document.getElementById("log").innerHTML = msg;
        }
    }
    $('#log').append('<p>' + msg + '</p>');
}

/* Timestamp Function for Logs */
function timestamp() {
    var str = "";

    var currentTime = new Date();
    var day = currentTime.getDate();
    var month = currentTime.getMonth() + 1;
    var year = currentTime.getFullYear();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    var seconds = currentTime.getSeconds();

    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    str += day + "/" + month + "/" + year + " ";
    str += hours + ":" + minutes + ":" + seconds;
    return str;
}

/* Function to handle key presses */
function keyHandler(event) {
    var chCode = ('charCode' in event) ? event.charCode : event.keyCode;
    var letter = String.fromCharCode(chCode);

    if (letter == 'l') {
        if ($("#log").css("display") == 'none') {
            $("#log").css("display", "block");
        }
        else {
            $("#log").css("display", "none");
        }
    }
    else if (letter == 'i') {
        if ($("#info").css("display") == 'none') {
            /* Position the info div */
            sw = $("#screen").width();
            sh = $("#screen").height();
            
            x = Math.round((sw - 500) / 2);
            y = Math.round((sh - 400) / 2);
            
            if (x > 0) {
                $("#info").css("left", x);
            }
            
            if (y > 0) {
                $("#info").css("top", y);
            }
            
            /* Make info div visible */
            $("#info").css("display", "block");
        }
        else {
            $("#info").css("display", "none");
        }
    }
}

function layout(id) {
    /* Layout Object */
    /* Parses a layout and when run runs it in containerName */
    
    var self = this;
    
    self.parseXlf = function(data) {
        playLog(10, "debug", "Parsing Layout " + self.id, false);
        self.containerName = "L" + self.id + "-" + nextId();
        
        /* Create a hidden div to show the layout in */
        $("#screen").append('<div id="' + self.containerName + '"></div>');
        $("#" + self.containerName).css("display", "none");
        $("#" + self.containerName).css("outline", "red solid thin");
        
        /* Calculate the screen size */
        self.sw = $("#screen").width();
        self.sh = $("#screen").height();
        playLog(7, "debug", "Screen is (" + self.sw + "x" + self.sh + ") pixels");
        
        /* Find the Layout node in the XLF */
        self.layoutNode = data;
        
        /* Get Layout Size */
        self.xw = $(self.layoutNode).find("layout").attr('width');
        self.xh = $(self.layoutNode).find("layout").attr('height');
        playLog(7, "debug", "Layout is (" + self.xw + "x" + self.xh + ") pixels");
        
        /* Calculate Scale Factor */
        self.scaleFactor = Math.min((self.sw/self.xw), (self.sh/self.xh));
        self.sWidth = Math.round(self.xw * self.scaleFactor);
        self.sHeight = Math.round(self.xh * self.scaleFactor);
        self.offsetX = Math.abs(self.sw - self.sWidth) / 2;
        self.offsetY = Math.abs(self.sh - self.sHeight) / 2;
        playLog(7, "debug", "Scale Factor is " + self.scaleFactor);
        playLog(7, "debug", "Render will be (" + self.sWidth + "x" + self.sHeight + ") pixels");
        playLog(7, "debug", "Offset will be (" + self.offsetX + "," + self.offsetY + ") pixels");
        
        /* Scale the Layout Container */
        $("#" + self.containerName).css("width", self.sWidth + "px");
        $("#" + self.containerName).css("height", self.sHeight + "px");
        $("#" + self.containerName).css("position", "absolute");
        $("#" + self.containerName).css("left", self.offsetX + "px");
        $("#" + self.containerName).css("top", self.offsetY + "px");
        
        /* Set the layout background */
        self.bgColour = $(self.layoutNode).filter(":first").attr('bgcolor');
        self.bgImage = $(self.layoutNode).filter(":first").attr('background');
        
        //$("#" + self.containerName).css("background-color", self.bgColour);
        
        if (!(self.bgImage == "" || self.bgImage == undefined)) {
            /* Extract the image ID from the filename */
            self.bgId = self.bgImage.substring(0, self.bgImage.indexOf('.'));
            
            //PRELOAD.addFiles("index.php?p=module&mod=image&q=Exec&method=GetResource&mediaid=" + self.bgId + "&width=" + self.sWidth + "&height=" + self.sHeight + "&dynamic&proportional=0");
            //$("#" + self.containerName).css("background", "url('index.php?p=module&mod=image&q=Exec&method=GetResource&mediaid=" + self.bgId + "&width=" + self.sWidth + "&height=" + self.sHeight + "&dynamic&proportional=0')");
            //$("#" + self.containerName).css("background-repeat", "no-repeat");
            //$("#" + self.containerName).css("background-size", self.sWidth + "px " + self.sHeight + "px");
            //$("#" + self.containerName).css("background-position", "0px 0px");
        }
        
        $(self.layoutNode).find("region").each(function() { playLog(4, "debug", "Creating region " + $(this).attr('id'), false);
                                                 self.regionObjects.push(new region(self, $(this).attr('id'), this));
                                               });
        playLog(4, "debug", "Layout " + self.id + " has " + self.regionObjects.length + " regions");
        self.ready = true;
        PRELOAD.addFiles('../local/img/loader.gif');
        PRELOAD.on('finish', self.run);
    };

    self.run = function() {
        playLog(4, "debug", "Running Layout ID " + self.id, false);
        if (self.ready) {
            $("#" + self.containerName).css("display", "block");
            $("#splash").css("display", "none");
            for (var i = 0; i < self.regionObjects.length; i++) {
                playLog(4, "debug", "Running region " + self.regionObjects[i].id, false);
                self.regionObjects[i].run();
            }
        }
        else {
            playLog(4, "error", "Attempted to run Layout ID " + self.id + " before it was ready.", false);
        }
    };
    
    self.end = function() {
        /* Ask the layout to gracefully stop running now */
        for (var i = 0; i < self.regionObjects.length; i++) {
            self.regionObjects[i].end();
        }
    };
    
    self.destroy = function() {
        /* Forcibly remove the layout and destroy this object
           Layout Object may not be reused after this */
    };

    self.regionExpired = function() {
        /* One of the regions on the layout expired
           Check if all the regions have expired, and if they did
           end the layout */
        playLog(5, "debug", "A region expired. Checking if all regions have expired.", false);
        
        self.allExpired = true;
        
        for (var i = 0; i < self.regionObjects.length; i++) {
            playLog(4, "debug", "Region " + self.regionObjects[i].id + ": " + self.regionObjects[i].complete, false);
            if (! self.regionObjects[i].complete) {
                self.allExpired = false;
            }
        }
        
        if (self.allExpired) {
            playLog(4, "debug", "All regions have expired", false);
            self.end();
        }
    };
    
    self.regionEnded = function() {
        /* One of the regions completed it's exit transition
           Check al the regions have completed exit transitions.
           If they did, bring on the next layout */
           
        playLog(5, "debug", "A region ended. Checking if all regions have ended.", false);
        
        self.allEnded = true;
        
        for (var i = 0; i < self.regionObjects.length; i++) {
            playLog(4, "debug", "Region " + self.regionObjects[i].id + ": " + self.regionObjects[i].ended, false);
            if (! self.regionObjects[i].ended) {
                self.allEnded = false;
            }
        }
        
        if (self.allEnded) {
            playLog(4, "debug", "All regions have ended", false);
            $("#end").css("display", "block");
            $("#" + self.containerName).remove();
        }

    };
    
    self.ready = false;
    self.id = id;
    self.regionObjects = new Array();
    
    playLog(3, "debug", "Loading Layout " + self.id , true);
    
    $.get('preview!getxlf.action', {layoutid: self.id}, self.parseXlf);
}

function region(parent, id, xml) {
    var self = this;
    self.layout = parent;
    self.id = id;
    self.xml = xml;
    self.mediaObjects = new Array();
    self.currentMedia = -1;
    self.complete = false;
    self.containerName = "R-" + self.id + "-" + nextId();
    self.ending = false;
    self.ended = false;
    self.oneMedia = false;
    self.oldMedia = undefined;
    self.curMedia = undefined;
    
    self.finished = function() {
        self.complete = true;
        self.layout.regionExpired()
    }
    
    self.exitTransition = function() {
        /* TODO: Actually implement region exit transitions */
        $("#" + self.containerName).css("display", "none");
        self.exitTransitionComplete();
    }
    
    self.end = function() {
        self.ending = true;
        /* The Layout has finished running */
        /* Do any region exit transition then clean up */
        self.exitTransition();
    }
    
    self.exitTransitionComplete = function() {
        self.ended = true;
        self.layout.regionEnded();
    }
    
    self.transitionNodes = function(oldMedia, newMedia) {
        /* TODO: Actually support the transition */
        
        if (oldMedia == newMedia) {
            return;
        }
        
        newMedia.run();
        
        if (oldMedia) {
            $("#" + oldMedia.containerName).css("display", "none");
        }
        
        $("#" + newMedia.containerName).css("display", "block");
    }
    
    self.nextMedia = function() {
        /* The current media has finished running */
        /* Show the next item */
        
        if (self.ended) {
            return;
        }
        
        if (self.curMedia) {
            playLog(8, "debug", "nextMedia -> Old: " + self.curMedia.id);
            self.oldMedia = self.curMedia;
        }
        else {
            self.oldMedia = undefined;
        }
        
        self.currentMedia = self.currentMedia + 1;

        if (self.currentMedia >= self.mediaObjects.length) {
            self.finished();
            self.currentMedia = 0;
        } else {
            playLog(8, "debug", "nextMedia -> Next up is media " + (self.currentMedia + 1) + " of " + self.mediaObjects.length);
            self.curMedia = self.mediaObjects[self.currentMedia];
            playLog(8, "debug", "nextMedia -> New: " + self.curMedia.id);
            /* Do the transition */
            self.transitionNodes(self.oldMedia, self.curMedia);
        }
    }
    
    self.run = function() {
        self.nextMedia();
    }
    
    self.sWidth = $(xml).attr("width") * self.layout.scaleFactor;
    self.sHeight = $(xml).attr("height") * self.layout.scaleFactor;
    self.offsetX = $(xml).attr("left") * self.layout.scaleFactor;
    self.offsetY = $(xml).attr("top") * self.layout.scaleFactor;
    self.zindex = $(xml).attr("zindex");
    
    $("#" + self.layout.containerName).append('<div id="' + self.containerName + '"></div>');
    
    /* Scale the Layout Container */
    $("#" + self.containerName).css("width", self.sWidth + "px");
    $("#" + self.containerName).css("height", self.sHeight + "px");
    $("#" + self.containerName).css("position", "absolute");
    $("#" + self.containerName).css("left", self.offsetX + "px");
    $("#" + self.containerName).css("top", self.offsetY + "px");
    $("#" + self.containerName).css("z-index", self.zindex);

    playLog(4, "debug", "Created region " + self.id, false);
    playLog(7, "debug", "Render will be (" + self.sWidth + "x" + self.sHeight + ") pixels");
    playLog(7, "debug", "Offset will be (" + self.offsetX + "," + self.offsetY + ") pixels");
    
    $(self.xml).find("media").each(function() { playLog(5, "debug", "Creating media " + $(this).attr('id'), false);
                                                self.mediaObjects.push(new media(self, $(this).attr('id'), this));
                                              });
    playLog(4, "debug", "Region " + self.id + " has " + self.mediaObjects.length + " media items");
}

function media(parent, id, xml) {
    var self = this;
    self.region = parent;
    self.xml = xml;
    self.id = id;
    self.containerName = "M-" + self.id + "-" + nextId();
    self.iframeName = self.containerName + "-iframe";
    self.mediaType = $(self.xml).attr('type');
    
    self.run = function() {
        playLog(5, "debug", "Running media " + self.id + " for " + self.duration + " seconds");
        
        if ((self.mediaType == "text") || (self.mediaType == "ticker") || (self.mediaType == "datasetview")) {
            // Scale the body tag so text/tickers/datasetviews are shown
            // at the correct size
            //$("#" + self.iframeName).contents().find('body').css("zoom", self.region.layout.scaleFactor);
        }
        
        /*
        if (self.mediaType == "video") {
            $("#" + self.containerName + "-vid").get(0).play();
        }*/
        
        if (self.duration == 0) {
        	/*
            if (self.mediaType == "video") {
                $("#" + self.containerName + "-vid").bind("ended", self.region.nextMedia);
            }
            else {
                self.duration = 10;
                setTimeout(self.region.nextMedia, self.duration * 1000);
            }*/
            self.duration = 10;
            setTimeout(self.region.nextMedia, self.duration * 1000);
        }
        else {
            setTimeout(self.region.nextMedia, self.duration * 1000);
        }
    };
    
    self.divWidth = self.region.sWidth;
    self.divHeight = self.region.sHeight;
    
    /* Build Media Options */
    self.duration = $(self.xml).attr('duration');
    self.lkid = $(self.xml).attr('lkid');
    self.options = new Array();
    
    $(self.xml).find('options').children().each(function() { playLog(9, "debug", "Option " + this.nodeName.toLowerCase() + " -> " + $(this).text(), false);
                                                             self.options[this.nodeName.toLowerCase()] = $(this).text();
                                                });
    
    $("#" + self.region.containerName).append('<div id="' + self.containerName + '"></div>');

    /* Scale the Content Container */
    $("#" + self.containerName).css("display", "none");
    $("#" + self.containerName).css("width", self.divWidth + "px");
    $("#" + self.containerName).css("height", self.divHeight + "px");
    $("#" + self.containerName).css("position", "absolute");
    /* $("#" + self.containerName).css("left", self.offsetX + "px");
    $("#" + self.containerName).css("top", self.offsetY + "px"); */
    
    if (self.mediaType == "image") {
        var tmpUrl = "/image/" + self.options['uri'] + "?_r=" + Math.random();
        PRELOAD.addFiles(tmpUrl);
        $("#" + self.containerName).css("background-image", "url('" + tmpUrl + "')");
    }
    else if (self.mediaType == "text") {
    	var tmpUrl = 'preview!gettext.action?textid=' + self.id + '&width=' + Math.round(self.divWidth) + '&height=' + Math.round(self.divHeight);
        $("#" + self.containerName).append('<iframe scrolling="no" id="' + self.iframeName + '" src="' + tmpUrl + '" width="' + self.divWidth + 'px" height="' + self.divHeight + 'px" style="border:0;"></iframe>');
    }
    else if (self.mediaType == "video") {
    	/*
    	var tmpUrl = "/video/" + self.options['uri'];
        PRELOAD.addFiles(tmpUrl);
        $("#" + self.containerName).append('<video id="' + self.containerName + '-vid" preload="auto"><source src="' + tmpUrl + '"></video>');
        */
        var tmpUrl = "/image/gif/" + self.id + ".gif" + "?_r=" + Math.random();
        PRELOAD.addFiles(tmpUrl);
        $("#" + self.containerName).css("background-image", "url('" + tmpUrl + "')");
    }
    else {
        $("#" + self.containerName).css("outline", "red solid thin");
    }
    $("#" + self.containerName).css("background-size", "contain");
    $("#" + self.containerName).css("background-repeat", "no-repeat");
    $("#" + self.containerName).css("background-position", "center");
    
    playLog(5, "debug", "Created media " + self.id)
}

