function LoadBase64EncodeDecode(view) {
    $("#m_content").html(Handlebars.compile(view)(DevGizmos.contentData));

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

        window.onresize = function () {
            ResizeEditor();
        };

        ResizeEditor();
    });
    
    DevGizmos.hideLoading();
}

function ResizeEditor() {
    $("#editor1").height(window.innerHeight - 185);
    $("#editor2").height(window.innerHeight - 185);
    DevGizmos.contentData.editor1.layout();
    DevGizmos.contentData.editor2.layout();
}

function Encode() {
    var encodedString = btoa(DevGizmos.contentData.editor1.getValue());
    DevGizmos.contentData.editor2.setValue(encodedString);
}

function Decode() {
    var encodedString = atob(DevGizmos.contentData.editor1.getValue());
    DevGizmos.contentData.editor2.setValue(encodedString);
}