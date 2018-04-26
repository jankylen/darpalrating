$(function () {
    /* 选择语言 */
    $("#language").on('change', function() {
        var language = $(this).children('option:selected').val();
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
                    $(this).html($.i18n.prop($(this).data("locale")));
                });
            }
        });
    };
    // loadProperties($('#language').children('option:selected').val()); //优先加载中文
    //判断显示中英文
    $.ajax({
        url:'http://47.94.240.141:8080/api/address/getLocation',
        type: 'GET',
        // cache:false,
        dataType:'json',
        data: {},
        success:function (res) {
            // console.log(res.msg);
            if(res.msg == 'ZH'){
                loadProperties(res.msg.toLocaleLowerCase())
            }else {
                loadProperties(res.msg.toLocaleLowerCase())
            }
        }
    });
});