var JSHelpers = {
    generateGuid: function () {
        const ho = (n, p) => n.toString(16).padStart(p, 0); /// Return the hexadecimal text representation of number `n`, padded with zeroes to be of length `p`
        const view = new DataView(new ArrayBuffer(16)); /// Create a view backed by a 16-byte buffer
        crypto.getRandomValues(new Uint8Array(view.buffer)); /// Fill the buffer with random data
        view.setUint8(6, (view.getUint8(6) & 0xf) | 0x40); /// Patch the 6th byte to reflect a version 4 UUID
        view.setUint8(8, (view.getUint8(8) & 0x3f) | 0x80); /// Patch the 8th byte to reflect a variant 1 UUID (version 4 UUIDs are)
        return `${ho(view.getUint32(0), 8)}-${ho(view.getUint16(4), 4)}-${ho(view.getUint16(6), 4)}-${ho(view.getUint16(8), 4)}-${ho(view.getUint32(10), 8)}${ho(view.getUint16(14), 4)}`; /// Compile the canonical textual form from the array data
    },
    copy: function (input) {
        input.select();
        input.setSelectionRange(0, 99999);
        document.execCommand("copy");
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

            try {
                gtag('config', 'G-8B7VWF3KW3', {'page_path': '/#!' + name});
            } catch (err) {
                console.error(err);
            }
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
                            if (typeof UnloadPage !== "undefined") {
                                UnloadPage();
                            }
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

    $("body").css({ 'padding-top': document.querySelector("#m_header > div > nav").offsetHeight + 10 });
});