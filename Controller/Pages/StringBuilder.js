function LoadStringBuilder(view) {
    $("#m_content").html(Handlebars.compile(view)(DevGizmos.contentData));
    DevGizmos.hideLoading();

    DevGizmos.contentData.editor1 = {};
    DevGizmos.contentData.editor2 = {};

    require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.21.2/min/vs' } });

    require(['vs/editor/editor.main'], function () {
        DevGizmos.contentData.editor1 = monaco.editor.create(document.getElementById('editor1'), {
            value: [].join('\n'),
            language: 'json',
            theme: 'vs',
            wordWrap: 'on'
        });

        DevGizmos.contentData.editor2 = monaco.editor.create(document.getElementById('editor2'), {
            value: [].join('\n'),
            language: 'json',
            theme: 'vs',
            wordWrap: 'on',
            readOnly: true
        });

        DevGizmos.contentData.editor1.onDidChangeModelContent(function (e) {
            DevGizmos.contentData.editor2.setValue(BuildString(DevGizmos.contentData.editor1.getValue()));
        });

        window.onresize = function () {
            ResizeEditor();
        };

        ResizeEditor();
    });
}

function ResizeEditor() {
    $("#editor1").height(window.innerHeight - 150);
    $("#editor2").height(window.innerHeight - 150);
    DevGizmos.contentData.editor1.layout();
    DevGizmos.contentData.editor2.layout();
}

function BuildString(string) {
    var newLine = "\n";

    var result = "StringBuilder str = new StringBuilder();" + newLine + newLine;
    var arrayOfLines = string.match(/[^\r\n]+/g);

    for (var i = 0; i < arrayOfLines.length; i++){
        result += "str.AppendLine(\"" + arrayOfLines[i].replace(/"/g, '\\"') + "\");" + newLine;
    }

    return result;
}