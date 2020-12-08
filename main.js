var JSHelpers = {
    generateGuid: function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
};

var DevGizmos = {
    contentData: {},
    headerData: {},
    currentPage: "Home",

    popStateResponder: function () {
        var name = window.location.hash.match(/\w+$/)[0];
        DevGizmos.loadPage(name);
    },

    loadPage: function (name) {
        DevGizmos.showLoading();
        DevGizmos.currentPage = name;
        DevGizmos.compilePage(name);

        if (window.location.search == "") {
            window.history.pushState(null, null, "#!" + name);
        }

        return false;
    },

    compile: function () {
        $.ajax({
            url: "Content/Generic/header.html?r=" + JSHelpers.generateGuid(),
            type: "GET",
            async: false,
            success: function (header) {
                $("#m_header").html(Handlebars.compile(header)(DevGizmos.headerData));
            },
            error: DevGizmos.displayAjaxError
        });
        
        $.ajax({
            url: "Content/Generic/footer.html?r=" + JSHelpers.generateGuid(),
            type: "GET",
            async: false,
            success: function (footer) {
                $("#m_footer").html(Handlebars.compile(footer)(DevGizmos.headerData));
            },
            error: DevGizmos.displayAjaxError
        });
    },

    compilePage: function (name) {
        console.log("Compile: " + name);
        var _view = null;
        var _js = null;

        $.ajax({
            url: "Content/Pages/" + name + ".html?r=" + JSHelpers.generateGuid(),
            type: "GET",
            async: true,
            success: function (view) {
                _view = view;
                $.ajax({
                    url: "Controller/Pages/" + name + ".js?r=" + JSHelpers.generateGuid(),
                    type: "GET",
                    async: true,
                    success: function (js) {
                        _js = js;
        
                        var element = document.getElementById("ContentScript");
                        if (element != null) {
                            element.parentNode.removeChild(element);
                        }
        
                        var script = document.createElement("script");
                        script.id = "ContentScript";
                        script.innerHTML = _js;
                        document.body.appendChild(script);
        
                        if (_view != null && _js != null) {
                            window["Load" + name](_view);
                        }
                    },
                    error: DevGizmos.displayAjaxError
                });
            },
            error: DevGizmos.displayAjaxError
        });
    },

    showLoading: function () {
        document.body.style.cursor = 'wait';
        $("#LoaderOverlay").show();
    },

    hideLoading: function () {
        document.body.style.cursor = 'default';
        $("#LoaderOverlay").hide();
    },
};

$(document).ready(function () {
    $(window).on('popstate', DevGizmos.popStateResponder);
    DevGizmos.compile();
    var pageName = window.location.hash.replace("/", "").replace("#!", "");

    if (pageName === "") {
        DevGizmos.loadPage("Home");
    } else {
        DevGizmos.loadPage(pageName);
    }

    $("body").css({'padding-top': document.querySelector("#m_header > div > nav").offsetHeight + 10});
});