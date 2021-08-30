function LoadJSONBeautifier(view) {
    $("#m_content").html(Handlebars.compile(view)(DevGizmos.contentData));
    DevGizmos.hideLoading();

    DevGizmos.contentData.editor1 = {};
    DevGizmos.contentData.editor2 = {};

    require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.21.2/min/vs' } });

    require(['vs/editor/editor.main'], function () {
        DevGizmos.contentData.editor1 = monaco.editor.create(document.getElementById('editor1'), {
            value: [].join('\n'),
            language: 'json',
            theme: halfmoon.darkModeOn ? 'vs-dark' : 'vs',
            wordWrap: 'on'
        });

        DevGizmos.contentData.editor2 = monaco.editor.create(document.getElementById('editor2'), {
            value: [].join('\n'),
            language: 'json',
            theme: halfmoon.darkModeOn ? 'vs-dark' : 'vs',
            wordWrap: 'on',
            readOnly: true
        });

        DevGizmos.contentData.editor1.onDidChangeModelContent(function (e) {
            if (ValidateJSON(DevGizmos.contentData.editor1.getValue())) {
                var formattedJson = JSON.stringify(JSON.parse(DevGizmos.contentData.editor1.getValue()), null, "\t");
                DevGizmos.contentData.editor2.setValue(formattedJson);
            } else {
                DevGizmos.contentData.editor2.setValue("Invalid JSON input");
            }
        });

        window.onresize = function () {
            ResizeEditor();
        };

        ResizeEditor();
    });
}

function ValidateJSON(json) {
    try {
        JSON.parse(json);
        return true;
    } catch (e) {
        return false;
    }
}

function ResizeEditor() {
    $("#editor1").height(window.innerHeight - 155);
    $("#editor2").height(window.innerHeight - 155);
    DevGizmos.contentData.editor1.layout();
    DevGizmos.contentData.editor2.layout();
}