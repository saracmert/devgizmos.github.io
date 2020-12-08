function LoadHome(view) {
    $.ajax({
        url: "Data/Home.json?r=" + JSHelpers.generateGuid(),
        type: "GET",
        async: false,
        success: function (data) {
            DevGizmos.contentData.Tools = data;
            $("#m_content").html(Handlebars.compile(view)(DevGizmos.contentData));
            DevGizmos.hideLoading();
        },
        error: DevGizmos.displayAjaxError
    });
}