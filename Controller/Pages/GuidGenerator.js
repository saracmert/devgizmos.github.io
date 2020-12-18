function LoadGuidGenerator(view) {
    $("#m_content").html(Handlebars.compile(view)(DevGizmos.contentData));
    DevGizmos.hideLoading();
}

function GenerateGuids() {
    var count = parseInt($("#txtCount").val());
    var isUppercase = $("#cbUppercase").is(':checked');

    $("#txtGuids").val("");

    var guids = [];
    for (var i = 0; i < count; i++) {
        var guid = JSHelpers.generateGuid();
        guids.push((isUppercase ? guid.toUpperCase() : guid));
    }

    $("#txtGuids").val(guids.join("\n"));
}