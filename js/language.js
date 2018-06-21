$(function () {
    var defaultLanguage = localStorage.language || 'zh';
    for(var i = 0;i<$('.languages').length;i++){
        if($('.languages')[i].value === defaultLanguage){
            $('.languages')[i].setAttribute('selected','selected')
        }
    }
    /* 选择语言 */
    $("#language").on('change', function() {
        var language = $(this).children('option:selected').val();
        localStorage.language = language;
        loadProperties(language);
    });
    var loadProperties =  function (language) {
        $.i18n.properties({
            name:'strings',    //属性文件名     命名格式： 文件名_国家代号.properties
            path:'i18n/',   //注意这里路径是你属性文件的所在文件夹
            mode:'map',
            language:language,     //这就是国家代号 name+language刚好组成属性文件名：strings+zh -> strings_zh.properties
            callback:function(){
                $("[data-locale]").each(function(){
//                        console.log($(this).data("locale"));
//                     console.log($(this));
                    $(this).html($.i18n.prop($(this).data("locale")));
                });
            }
        });
    };
    // loadProperties($('#language').children('option:selected').val()); //优先加载中文
    if (localStorage.language) {
        return loadProperties(localStorage.language)
    }
    //判断显示中英文
    $.ajax({
        url:'http://47.100.236.14/api/address/getLocation',
        type: 'GET',
        // cache:false,
        dataType:'json',
        data: {},
        success:function (res) {
            if(res.msg == 'ZH'){
                loadProperties(res.msg.toLocaleLowerCase())
            }else {
                loadProperties(res.msg.toLocaleLowerCase())
            }
        }
    });
});