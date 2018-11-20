(function($){
    $('#submit').click(function (e) {
        e.preventDefault();
        var fileEle = $('#formControlFile')
        var files = fileEle.get(0).files
        // 获取 csv 文件
        var file = files[0]
        if (!file) {
            return alert('请选择文件~')
        }
        if (!checkIsCsv(file.name)) {
            return alert('选择的文件不是 .csv 后缀的，请重新选择！')
        }
        upload()
    })
    
    /**
     * 校验文件后缀是否是 .csv
     */
    function checkIsCsv(path) {
        if (/.csv$/.test(path)) {
            return true
        } else {
            return false
        }
    }
    
    var uploading = false;
    /**
     * 上传文件
     */
    function upload() {
        if (uploading) {
            alert("文件正在上传中，请稍候");
            return false;
        }
        $.ajax({
            url: "/api/turn",
            type: 'POST',
            data: new FormData($('#formControl')[0]),
            processData: false,
            contentType: false,
            dataType: "json",
            beforeSend: function () {
                $('#submit').text('提交中...')
                uploading = true;
            },
            success: function (data) {
                $('#submit').text('提交中')
                uploading = false;
                if (!data) {
                    return alert('转换失败！')
                }
                funDownload(JSON.stringify(data), 'data.json')
            },
            error: function (data) {
                alert('上传失败')
                $('#submit').text('提交中')
                uploading = false;  
            }
        })
    }
    
    /**
     * 将字符串当做文本下载
     * @param {*} content  文本内容
     * @param {*} filename  文件名
     */
    function funDownload(content, filename) {
        // 创建隐藏的可下载链接
        var eleLink = document.createElement('a');
        eleLink.download = filename;
        eleLink.style.display = 'none';
        // 字符内容转变成blob地址
        var blob = new Blob([content]);
        eleLink.href = URL.createObjectURL(blob);
        // 触发点击
        document.body.appendChild(eleLink);
        eleLink.click();
        // 然后移除
        document.body.removeChild(eleLink);
    }
})($)