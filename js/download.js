$(function () {
    $.ajax({
        url:'http://47.94.240.141:8080/api/rating/getSummaryList',
        type: 'GET',
        // cache:false,
        dataType:'json',
        data: {},
        success:function (res) {
            var result = res.data;
            CreateTable(result)
        }
    });
    function CreateTable(result) {
        result.forEach(function (item) {
            // console.log(item);
            var id = item.id;                   //id
            var coinNameCn = item.coinNameCn;       //中文全称
            var coinNameEn = item.coinNameEn;       //英文全称
            var symbol = item.symbol;               //英文简称
            var logoUrl = item.logoUrl;             //背景图url
            var risk = item.risk;                   //risk  0 低 1 中 2高
            var popularity = item.popularity;       //pop   0 低 1 中 2高
            var potential = item.potential;         //potential -1极低extra low，0低Low ，1中Medium，2高High，3极高extra high
            var score = item.score;                 //score
            var downloadUrl = item.downloadUrl;     //report下载url
            var Down_table = $('.Down_table');
            $('<tr></tr>').addClass('trs'+id+' trs').appendTo(Down_table);
                $('<td>'+symbol+'</td>').css({
                    backgroundImage:'url('+logoUrl+')'
                }).addClass('type_name').attr('title',coinNameEn).appendTo($('.trs'+id));
                $('<td></td>').addClass('type_risk'+id+' type_risk type_RPR').appendTo($('.trs'+id));
                    if(risk == '0'){
                        $('<span>'+"低"+'</span>').addClass('RS_HML').attr('data-locale','Low').appendTo($('.type_risk'+id));
                    }else if(risk == '1'){
                        $('<span>'+"中"+'</span>').addClass('RS_HML').attr('data-locale','Medium').appendTo($('.type_risk'+id));
                    }else if(risk == '2'){
                        $('<span>'+"高"+'</span>').addClass('RS_HML').attr('data-locale','High').appendTo($('.type_risk'+id));
                    }else {
                        $('<span>'+"暂无"+'</span>').addClass('RS_HML').attr('data-locale','NotAvailable').appendTo($('.type_risk'+id));
                    }
                $('<td></td>').addClass('type_popular'+id+' type_popular type_RPR').appendTo($('.trs'+id));
                    if(popularity == '0'){
                        $('<span>'+"低"+'</span>').addClass('Popular_HML').attr('data-locale','Low').appendTo($('.type_popular'+id));
                    }else if(popularity == '1'){
                        $('<span>'+"中"+'</span>').addClass('Popular_HML').attr('data-locale','Medium').appendTo($('.type_popular'+id));
                    }else if(popularity == '2'){
                        $('<span>'+"高"+'</span>').addClass('Popular_HML').attr('data-locale','High').appendTo($('.type_popular'+id));
                    }else {
                        $('<span>'+"暂无"+'</span>').addClass('Popular_HML').attr('data-locale','NotAvailable').appendTo($('.type_popular'+id));
                    }
                $('<td></td>').addClass('type_potential'+id+' type_potential type_RPR').appendTo($('.trs'+id));
                   if(potential == '-1'){
                       $('<span>'+"极低"+'</span>').addClass('Potential_HML').attr('data-locale','ExtraLow').appendTo($('.type_potential'+id));
                   }else if(potential == '0'){
                       $('<span>'+"低"+'</span>').addClass('Potential_HML').attr('data-locale','Low').appendTo($('.type_potential'+id));
                   }else if(potential == '1'){
                       $('<span>'+"中"+'</span>').addClass('Potential_HML').attr('data-locale','Medium').appendTo($('.type_potential'+id));
                   }else if(potential == '2'){
                       $('<span>'+"高"+'</span>').addClass('Potential_HML').attr('data-locale','High').appendTo($('.type_potential'+id));
                   }else if(potential == '3'){
                       $('<span>'+"极高"+'</span>').addClass('Potential_HML').attr('data-locale','ExtraHigh').appendTo($('.type_potential'+id));
                   }else {
                       $('<span>'+"暂无"+'</span>').addClass('Potential_HML').attr('data-locale','NotAvailable').appendTo($('.type_potential'+id));
                   }
                $('<td></td>').addClass('type_rating'+id+' type_rating type_RPR').appendTo($('.trs'+id));
                    $('<span>'+score+'</span>').addClass('Rating_num').appendTo($('.type_rating'+id));

                $('<td></td>').addClass('type_report'+id+' type_report').appendTo($('.trs'+id));
                    $('<a>'+"下载报告 &darr;"+'</a>').addClass('Report_down').attr({
                        href:downloadUrl,
                        target:"_blank",
                        'data-locale':'DownloadReport'
                    }).appendTo($('.type_report'+id));
        });
    }
});
