function LoadJSKeyCode(view) {
    $("#m_content").html(Handlebars.compile(view)(DevGizmos.contentData));
    document.body.addEventListener("keydown", OnKeyDownEventListener);
    DevGizmos.hideLoading();
}

function UnloadPage() {
    document.body.removeEventListener("keydown", OnKeyDownEventListener);
}

function OnKeyDownEventListener(e) {
    var locationFriendlyName;

    switch (e.location) {
        default:
            locationFriendlyName = "Unknown";
            break;
        case 0:
            locationFriendlyName = "General Keys";
            break;
        case 1:
            locationFriendlyName = "Left Side Modifier";
            break;
        case 2:
            locationFriendlyName = "Right Side Modifier";
            break;
        case 3:
            locationFriendlyName = "Numpad";
            break;
    }

    $("#location").html(locationFriendlyName + "(" + e.location + ")");
    $("#code").text(e.code);
    $("#key").text(e.key);
    $("#keyCode").text(e.keyCode);

    e.preventDefault();
}