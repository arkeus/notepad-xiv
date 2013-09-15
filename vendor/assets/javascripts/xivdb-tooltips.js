function fPopGetScript(e, t) {
    var n = document.createElement("script");
    n.src = e;
    var r = document.getElementsByTagName("head")[0],
        i = !1;
    void 0 == r && (r = document.getElementsByTagName("body")[0]);
    n.onload = n.onreadystatechange = function () {
        i || this.readyState && "loaded" != this.readyState && "complete" != this.readyState || (i = !0, t(), n.onload = n.onreadystatechange = null, r.removeChild(n));
    };
    r.appendChild(n);
}

function fPopLoadTips() {
    "undefined" != typeof Prototype && jQuery.noConflict();
    jQuery.fn.simpletooltip || function (e) {
        e.fn.simpletooltip = function () {
            return this.each(function () {
            	var activate = function (t) {
                    e("#simpleTooltip").remove();
                    var n = e(this).data("tooltip"),
                        r = t.pageX + 5;
                    t = t.pageY + 5;
                    e("body").append("<div id='simpleTooltip' style='position: absolute; z-index: 9999; display: none;'>" + n + "</div>");
                    n = e("#simpleTooltip").width();
                    e("#simpleTooltip").width(n);
                    e("#simpleTooltip").css("left", r).css("top", t).show();
               };
               
               var move = function (t) {
                    var n = t.pageX + 12,
                        r = t.pageY + 12,
                        i = e("#simpleTooltip").outerWidth(!0),
                        s = e("#simpleTooltip").outerHeight(!0);
                    n + i > e(window).scrollLeft() + e(window).width() && (n = t.pageX - i);
                    e(window).height() + e(window).scrollTop() < r + s && (r = t.pageY - s);
                    e("#simpleTooltip").css("left", n).css("top", r).show();
               };
               
                void 0 != e(this).data("tooltip") && (e(this).hover(activate, function () {
                    e("#simpleTooltip").remove();
                }), e(this).mousemove(move));
                
                activate.call(e(this), { pageX: cursorX, pageY: cursorY });
                move.call(e(this), { pageX: cursorX, pageY: cursorY });
            });
        };
    }(jQuery);
	fPopLoadItem();
}

function fPopLoadItem() {
    "undefined" != typeof Prototype && jQuery.noConflict();
    //jQuery(".tooltip").each(function () {
    jQuery("body").on("mouseover", ".tooltip", function() {
        var e = jQuery(this).data("xivdb");
        if (jQuery(this).data("tooltip") !== undefined) {
        	return;
        }
        if (void 0 != e && (e = e.split("/"), "xivdb.com" == e[2] || "www.xivdb.com" == e[2] || "xivdatabase.com" == e[2] || "www.xivdatabase.com" == e[2] || "jp.xivdb.com" == e[2] || "en.xivdb.com" == e[2] || "de.xivdb.com" == e[2] || "fr.xivdb.com" == e[2])) {
            var t = jQuery(this),
                n = [];
            n["JP"] = 0;
            n["EN"] = 1;
            n["DE"] = 2;
            n["FR"] = 3;
            b = 1;
            if (typeof xivdb_tooltips !== "undefined" && typeof xivdb_tooltips.language !== "undefined") {
                b = n[xivdb_tooltips.language];
            }
            var r = e[4];
            void 0 == e[4] || !jQuery.isNumeric(e[4]) || "?item" != e[3] && "?skill" != e[3] && "?recipe" != e[3] || (jQuery.ajax({
                url: "http://www.xivdb.com/modules/fpop/fpop.php",
                data: {
                    id: r,
                    Language: b,
                    type: e[3],
                    Location: window.location.toString()
                },
                dataType: "jsonp",
                success: function (e) {
                    t.attr("title", "");
                    t.attr("href") == t.html() && t.html(e.name);
                    t.data("tooltip", e.html);
                    t.simpletooltip({
                        fixed: !0,
                        position: "bottom",
                        tooltip: e.html
                    });
                },
                error: function (e, t, n) {
                    console.log(t);
                    console.log(n);
                }
            }));
        }
    });
}

function fPopInit() {
    //console.log("Loading XIVDB Tooltips...");
    "undefined" == typeof jQuery ? fPopGetScript("//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js", fPopLoadTips) : fPopLoadTips();
}
initXIVDBTooltips = function() {
    var e = document.createElement("link");
    e.setAttribute("rel", "stylesheet");
    e.setAttribute("href", "http://xivdb.com/css/fpop_tt.css");
    e.setAttribute("type", "text/css");
    document.getElementsByTagName("head")[0].appendChild(e);
	var e = setInterval(function () {
        "complete" === document.readyState && (clearInterval(e), fPopInit());
    }, 10);
};
document.addEventListener('DOMContentLoaded',function(){ initXIVDBTooltips(); });

var cursorX;
var cursorY;
document.onmousemove = function(e) {
    cursorX = e.pageX;
    cursorY = e.pageY;
};
