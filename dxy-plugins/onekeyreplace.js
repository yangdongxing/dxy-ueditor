(function () {
    baidu.editor.ui.onekeyreplace = function (editor) {
        var btn = new UE.ui.Button({
            name: 'onekeyreplace',
            title: '丁香园标准格式化功能',
        });
        btn.addListener('click', function(){
            exeCommandReplaceButton(editor);
        });
        return btn;
    };

    function exeCommandReplaceButton(editor) {
        var content = editor.getData ? editor.getData() : editor.getContent();
        if (content && content.length > 0) {
            content = preg_replace("/(\\p{Han})([a-zA-Z0-9\\p{Ps}])(?![^<]*>)/ig", "\\1 \\2", content);
            content = preg_replace("/([a-zA-Z0-9\\p{Pe}])(\\p{Han})(?![^<]*>)/ig", "\\1 \\2", content);
            content = preg_replace("/([!?‽:;,.])(\\p{Han})/ig", "\\1 \\2", content);
            content = preg_replace("/(\\p{Han})(<[a-zA-Z]+?.*?>)/ig", "\\1 \\2", content);
            content = preg_replace("/(\p{Han})(<\/[a-zA-Z]+>)/ig", "\\1 \\2", content);
            content = preg_replace("/(<\/[a-zA-Z]+>)(\\p{Han})/ig", "\\1 \\2", content);
            content = preg_replace("/(%|％|‰|℃)(\\p{Han})/ig", "\\1 \\2", content);
            content = preg_replace("/(<[a-zA-Z]+?.*?>)(\\p{Han})/ig", "\\1\\2", content);
            content = preg_replace("/([0-9])(mmHg|mw|mm|g|μg|mg|kg|ml|min|h|cm)/ig", "\\1 \\2", content);
            content = preg_replace("/[ ]*([「」『』（）〈〉《》【】〔〕〖〗〘〙〚〛])[ ]*/ig", "\\1", content);
            content = preg_replace("/([a-zA-Z0-9\\p{Han}])([≤≥=])(?![^<]*>)/ig", "\\1 \\2", content);
            content = preg_replace("/([≤≥=])([a-zA-Z0-9\\p{Han}])(?![^<]*>)/ig", "\\1 \\2", content);
            //汉字英文和数字和大于等于，小于等于之间，加入空格（注：暂不处理 <> 由于这两个符号在 HTML 中会与标签重复，且闭合的 <> 被加入空格会造成问题）

            content = content.replace(/n(’|\&rsquo\;)t/ig, "n&rsq_temp;t");
            content = content.replace(/(’|\&rsquo\;)s/ig, "&rsq_temp;s");
            content = content.replace(/(’|\&rsquo\;)m/ig, "&rsq_temp;m");
            content = content.replace(/(’|\&rsquo\;)re/ig, "&rsq_temp;re");
            content = content.replace(/(’|\&rsquo\;)ve/ig, "&rsq_temp;ve");
            content = content.replace(/(’|\&rsquo\;)d/ig, "&rsq_temp;d");
            content = content.replace(/(’|\&rsquo\;)ll/ig, "&rsq_temp;ll");
            content = content.replace(/(“|\&ldquo\;)/ig, "「");
            content = content.replace(/(”|\&rdquo\;)/ig, "」");
            content = content.replace(/(‘|\&lsquo\;)/ig, "『");
            content = content.replace(/(’|\&rsquo\;)/ig, "』");
            content = content.replace(/&rsq_temp;/ig, "’");
            editor.setContent(content);
        }
    }


// preg_replace

        function preg_replace(pattern, pattern_replace, subject, limit) {
            if (limit === undefined) {
                limit = -1;
            }

            var _flag = pattern.substr(pattern.lastIndexOf(pattern[0]) + 1),
                    _pattern = pattern.substr(1, pattern.lastIndexOf(pattern[0]) - 1),
                    reg = new XRegExp(_pattern, _flag),
                    rs = null,
                    res = [],
                    x = 0,
                    y = 0,
                    ret = subject,
                    temp;

            if (limit === -1) {
                tmp = [];

                do {
                    tmp = reg.exec(subject);
                    if (tmp !== null) {
                        res.push(tmp);
                    }
                } while (tmp !== null && _flag.indexOf('g') !== -1);
            } else {
                res.push(reg.exec(subject));
            }

            for (x = res.length - 1; x > -1; x--) { //explore match
                tmp = pattern_replace;

                for (y = res[x].length - 1; y > -1; y--) {
                    tmp = tmp.replace('${' + y + '}', res[x][y])
                            .replace('$' + y, res[x][y])
                            .replace('\\' + y, res[x][y]);
                }
                ret = ret.replace(res[x][0], tmp);
            }
            return ret;
        }


})();
