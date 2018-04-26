$(function () {
    var url = 'http://47.94.240.141:8080/api/index/get?indexType=';
    Highcharts.setOptions({
        global: {
            timezoneOffset: -8 * 60     //Highchart 时区偏移问题解决。
        },
        colors: ['rgba(215,221,236,.7)', '#fff']
    });
    //MI  一开始先加载一次数据
    MIChartAjax();
    window.btcPrices = [];
    window.ethPrices = [];
    var flags = true;//第一次获取数据
    function MIChartAjax() {
        $.ajax({
            url: url + '2',
            type: 'GET',
            cache: false,
            dataType: 'json',
            data: {},
            beforeSend: function () {
                $('.BtcEth_checkBox').hide();
                $('<div></div>').addClass('loading').css({
                    textAlign:'center',
                    position:'absolute',
                    top:'30%',
                    left:'50%',
                    width:'100px',
                    height:'50px',
                    background:'url(images/loading.gif) no-repeat',
                    backgroundSize:'contain'
                }).prependTo($(".DPCBox"))
            },
            complete: function () {
                $(".loading").remove();
                $('.BtcEth_checkBox').show();
            },
            success: function (result) {
                //图表数据
                if (result.data) {
                    var indexValue = result.data.indexValue;
                    if (!flags) {
                        $('.MI_indexBox').html('');
                    }
                    flags = false;//不是第一次获取数据了,因为已经获取过了
                    var latestValue = result.data.latestValue;
                    var changeValue = result.data.changeValue;
                    var changePercent = result.data.changePercent;
                    var isPositive = result.data.isPositive;
                    //创建指数部分
                    var MI_indexBox = $('.MI_indexBox');
                    $('<div></div>').addClass('MI_indexBox-number').appendTo(MI_indexBox);
                    $('<div></div>').addClass('MI_indexBox-change').appendTo(MI_indexBox);
                    $('<span>' + latestValue + '</span>').appendTo($('.MI_indexBox-number'));

                    if (isPositive == '-1') {
                        $('<span>' + changeValue + '</span>').css({
                            color: '#D35121'
                        }).addClass('MI_changeValue').appendTo($('.MI_indexBox-change'));
                        $('<span>' + changePercent + '%' + '</span>').css({
                            color: '#D35121'
                        }).appendTo($('.MI_indexBox-change'));
                        $('<span>&darr;</span>').css({
                            color: '#D35121'
                        }).prependTo($('.MI_changeValue'));
                    } else {
                        $('<span>' + changeValue + '</span>').css({
                            color: '#48D321'
                        }).addClass('MI_changeValue').appendTo($('.MI_indexBox-change'));
                        $('<span>' + changePercent + '%' + '</span>').css({
                            color: '#48D321'
                        }).appendTo($('.MI_indexBox-change'));
                        $('<span>&uarr;</span>').css({
                            color: '#48D321'
                        }).prependTo($('.MI_changeValue'));
                    }

                    $("#BTC").click(function () {
                        if ($(this).is(":checked")) {
                            btcPrices = result.data.btcPrice;
                            dpc();
                        } else {
                            btcPrices = [];
                            dpc();
                        }
                    });
                    $('#ETH').click(function () {
                        if ($(this).is(":checked")) {
                            ethPrices = result.data.ethPrice;
                            dpc();
                        } else {
                            ethPrices = [];
                            dpc();
                        }
                    });
                    // create the chart
                    dpc();
                    function dpc() {
                        $('#MIChartBox').highcharts('StockChart', {
                            chart: {
                                type: 'areaspline'
                            },
                            legend: {           //图例
                                enabled: true,
                                align: 'center',
                                verticalAlign: 'bottom',
                                shadow: false
                            },
                            credits: {
                                enabled: false // 禁用版权信息
                            },
                            title: {
                                text: null
                            },
                            scrollbar: {
                                enabled: true      //开启/关闭滚动条
                            },
                            navigator: {
                                enabled: true     //开启/关闭导航器
                            },
                            exporting: {           //开启/关闭下载器
                                enabled: false
                            },
                            plotOptions: {
                                series: {
                                    showInLegend: true,
                                    events: {
                                        legendItemClick: function() {
                                            return false; // 直接 return false 即可禁用图例点击事件
                                        }
                                    }
                                },
                                areaspline: {
                                    fillColor: {
                                        linearGradient: {
                                            x1: 0,
                                            y1: 0,
                                            x2: 0,
                                            y2: 1
                                        },
                                        stops: [
                                            [0, Highcharts.getOptions().colors[0]],
                                            [1, Highcharts.Color(Highcharts.getOptions().colors[1]).setOpacity(0).get('rgba')]
                                        ]
                                    },
                                    lineColor: '#9CA3C0'   //曲线颜色
                                }
                            },
                            xAxis: {
                                type: 'datetime',
                                showLastLabel: true,
                                minTickInterval: 30,
                                labels: {
                                    step: 1
                                }
                                //                gridLineWidth:1，
                                //                gridLineDashStyle:'Dash'
                            },
                            yAxis:[
                                {
                                    type:'linear',
                                    tickAmount:6,        //Y轴刻度线数
                                    opposite: false,
                                    allowDecimals:false,  //是否在坐标轴标签中显示小数
                                    // tickInterval:1,
                                    tickPixelInterval:30,
                                    title: {
                                        text: null
                                    },
                                    labels: {
                                        enabled:true
                                    }
                                },
                                {
                                    type:'linear',
                                    tickAmount:6,        //Y轴刻度线数
//                                    opposite: false,
//                                    allowDecimals:false,
//                                     tickInterval:1,
                                    tickPixelInterval:30,
                                    title: {
                                        text: null
                                    },
                                    labels: {
                                        enabled:false
                                    }
                                },
                                {
                                    type:'linear',
                                    tickAmount:6,        //Y轴刻度线数
//                                    opposite: false,
//                                    allowDecimals:false,
//                                     tickInterval:1,
                                    tickPixelInterval:30,
                                    title: {
                                        text: null
                                    },
                                    labels: {
                                        enabled:false
                                    }
                                }
                            ],
                            rangeSelector: {
                                buttons: [
                                    {
                                        type: 'hour',
                                        count: 12,
                                        text: '12h'
                                    },
                                    {
                                        type: 'day',
                                        count: 1,
                                        text: '1D'
                                    }, {
                                        type: 'week',
                                        count: 1,
                                        text: '1W'
                                    }, {
                                        type: 'month',
                                        count: 1,
                                        text: '1M'
                                    }, {
                                        type: 'all',
                                        count: 1,
                                        text: 'All'
                                    }],
                                selected: 0,  //时间选择按钮的第几个按钮（下标）
                                inputEnabled: true,   //时间选择范围开启/关闭
                                inputBoxWidth: 95,
                                inputBoxBorderColor: 'none', //隐藏时间范围的颜色，可隐藏边框
                                labelStyle: {
                                    color: 'rgba(59,59,73,.5)'
                                }
                            },
                            tooltip: {
                                valueDecimals: 2,
                                shared: true,
                                xDateFormat: '%Y-%m-%d,%H:%M',
                                split: true      //数据提示框 上下分离true
                            },
                            series: [
                                {
                                    name: 'DPC',
                                    data: indexValue,
                                    threshold: null,
                                    yAxis: 0,
                                    lineColor: '#9CA3C0',
                                    color: '#9CA3C0'
                                }, {
                                    name: 'BTC',
                                    data: btcPrices,
                                    tooltip: {
                                        valuePrefix: '$',
                                        valueSuffix: ' USD'
                                    },
                                    threshold: null,
                                    yAxis: 1,
                                    lineColor: '#FBAF4F',
                                    color: '#FBAF4F',
                                    fillColor: 'transparent'
                                }, {
                                    name: 'ETH',
                                    data: ethPrices,
                                    tooltip: {
                                        valuePrefix: '$',
                                        valueSuffix: ' USD'
                                    },
                                    threshold: null,
                                    yAxis: 2,
                                    lineColor: '#22AAE1',
                                    color: '#22AAE1',
                                    fillColor: 'transparent'
                                }
                                /*  {
                                 type:'flags',  //标记点
                                 data:[{}]
                                 }*/
                            ]
                        });
                    }
                }
            }
        });
    }
    //5分钟刷新一次图表---> 此方式需修改
    setInterval(MIChartAjax,300000);
    //BVIX  一开始先加载一次数据
    BVIXChartAjax();
    window.BTCPrices=[];
    window.ETHPrices=[];
    var flag = true;//第一次获取数据
    function BVIXChartAjax() {
        $.ajax({
            url: url+'1',
            type: 'GET',
            cache:false,
            dataType:'json',
            data: {},
            success: function(result) {
                if(result.data){
                    //图表数据
                    var indexValue = result.data.indexValue;
                    if(!flag){
                        $('.indexBox').html('');
                    }
                    flag = false;//不是第一次获取数据了,因为已经获取过了
                    var latestValue = result.data.latestValue;
                    var changeValue = result.data.changeValue;
                    var changePercent = result.data.changePercent;
                    var isPositive = result.data.isPositive;
                    //创建指数部分
                    var indexBox = $('.indexBox');
                    $('<div></div>').addClass('indexBox-number').appendTo(indexBox);
                    $('<div></div>').addClass('indexBox-change').appendTo(indexBox);
                    $('<span>'+latestValue+'</span>').appendTo($('.indexBox-number'));

                    if(isPositive == '-1'){
                        $('<span>'+changeValue+'</span>').css({
                            color:'#D35121'
                        }).addClass('changeValue').appendTo($('.indexBox-change'));
                        $('<span>'+changePercent+'%'+'</span>').css({
                            color:'#D35121'
                        }).appendTo($('.indexBox-change'));
                        $('<span>&darr;</span>').css({
                            color:'#D35121'
                        }).prependTo($('.changeValue'));
                    }else {
                        $('<span>'+changeValue+'</span>').css({
                            color:'#48D321'
                        }).addClass('changeValue').appendTo($('.indexBox-change'));
                        $('<span>'+changePercent+'%'+'</span>').css({
                            color:'#48D321'
                        }).appendTo($('.indexBox-change'));
                        $('<span>&uarr;</span>').css({
                            color:'#48D321'
                        }).prependTo($('.changeValue'));
                    }
                    $("#BTCPrice").click(function () {
                        if ($(this).is(":checked")) {
                            BTCPrices = result.data.btcPrice;
                            bvix();
                        } else {
                            BTCPrices = [];
                            bvix();
                        }
                    });
                    $('#ETHPrice').click(function () {
                        if ($(this).is(":checked")) {
                            ETHPrices = result.data.ethPrice;
                            bvix();
                        } else {
                            ETHPrices = [];
                            bvix();
                        }
                    });
                    // create the chart
                    bvix();
                    function bvix() {
                        $('#BVIXChartBox').highcharts('StockChart', {
                            chart: {
                                type: 'areaspline'
                            },
                            /*  legend: {           //图例
                             enabled: true,
                             align: 'center',
                             verticalAlign: 'bottom',
                             shadow: false
                             },*/
                            credits:{
                                enabled: false // 禁用版权信息
                            },
                            title: {
                                text: null
                            },
                            scrollbar : {
                                enabled : true      //开启/关闭滚动条
                            },
                            navigator : {
                                enabled : true     //开启/关闭导航器
                            },
                            exporting: {           //开启/关闭下载器
                                enabled: false
                            },
                            plotOptions: {
                                series: {
                                    showInLegend: true,
                                    events: {
                                        legendItemClick: function() {
                                            return false; // 直接 return false 即可禁用图例点击事件
                                        }
                                    }
                                },
                                areaspline: {
                                    fillColor : {
                                        linearGradient : {
                                            x1: 0,
                                            y1: 0,
                                            x2: 0,
                                            y2: 1
                                        },
                                        stops : [
                                            [0, Highcharts.getOptions().colors[0]],
                                            [1, Highcharts.Color(Highcharts.getOptions().colors[1]).setOpacity(0).get('rgba')]
                                        ]
                                    },
                                    lineColor:'#9CA3C0'   //曲线颜色
                                }
                            },
                            xAxis:{
                                type:'datetime',
                                showLastLabel: true,
                                minTickInterval: 30,
                                labels:{
                                    step:1
                                }
                                //                gridLineWidth:1，
                                //                gridLineDashStyle:'Dash'
                            },
                            yAxis:[
                                {
                                    type:'linear',
                                    // tickAmount:6,        //Y轴刻度线数
                                    opposite: false,
                                    allowDecimals:false,  //是否在坐标轴标签中显示小数
                                    // tickInterval:1,
                                    tickPixelInterval:30,
                                    title: {
                                        text: null
                                    },
                                    labels: {
                                        enabled:true
                                    }
                                },
                                {
                                    type:'linear',
                                    // tickAmount:6,        //Y轴刻度线数
//                                    opposite: false,
//                                    allowDecimals:false,
//                                     tickInterval:1,
                                    tickPixelInterval:30,
                                    title: {
                                        text: null
                                    },
                                    labels: {
                                        enabled:false
                                    }
                                },
                                {
                                    type:'linear',
                                    // tickAmount:6,        //Y轴刻度线数
//                                    opposite: false,
//                                    allowDecimals:false,
//                                     tickInterval:1,
                                    tickPixelInterval:30,
                                    title: {
                                        text: null
                                    },
                                    labels: {
                                        enabled:false
                                    }
                                }
                            ],
                            rangeSelector: {
                                buttons: [
                                    {
                                        type: 'hour',
                                        count: 12,
                                        text: '12h'
                                    },
                                    {
                                        type: 'day',
                                        count: 1,
                                        text: '1D'
                                    }, {
                                        type: 'week',
                                        count: 1,
                                        text: '1W'
                                    }, {
                                        type: 'month',
                                        count: 1,
                                        text: '1M'
                                    }, {
                                        type: 'all',
                                        count: 1,
                                        text: 'All'
                                    }],
                                selected: 0,  //时间选择按钮的第几个按钮（下标）
                                inputEnabled: true,   //时间选择范围开启/关闭
                                inputBoxWidth: 95,
                                inputBoxBorderColor: 'none', //隐藏时间范围的颜色，可隐藏边框
                                labelStyle: {
                                    color: 'rgba(59,59,73,.5)'
                                }
                            },
                            tooltip: {
                                valueDecimals: 2,
                                shared: true,
                                xDateFormat: '%Y-%m-%d,%H:%M',
                                split: true      //数据提示框 上下分离true
                            },
                            series: [
                                {
                                    name: 'DPC',
                                    data: indexValue,
                                    threshold: null,
                                    yAxis: 0,
                                    lineColor: '#9CA3C0',
                                    color: '#9CA3C0'
                                }, {
                                    name: 'BTC',
                                    data: BTCPrices,
                                    tooltip: {
                                        valuePrefix: '$',
                                        valueSuffix: ' USD'
                                    },
                                    threshold: null,
                                    yAxis: 1,
                                    lineColor: '#FBAF4F',
                                    color: '#FBAF4F',
                                    fillColor: 'transparent'
                                }, {
                                    name: 'ETH',
                                    data: ETHPrices,
                                    tooltip: {
                                        valuePrefix: '$',
                                        valueSuffix: ' USD'
                                    },
                                    threshold: null,
                                    yAxis: 2,
                                    lineColor: '#22AAE1',
                                    color: '#22AAE1',
                                    fillColor: 'transparent'
                                }
                                /*  {
                                 type:'flags',  //标记点
                                 data:[{}]
                                 }*/
                            ]
                        });
                    }
                }
                else {
                    $('#BVIXChartBox').css({
                        textAlign:'center',
                        fontSize:'30px',
                        fontWeight:'border'
                    }).html(result.message);
                }
            }
        });
    }
    //20分钟刷新一次图表---> 此方式需修改
    setInterval(BVIXChartAjax,1200000);
});
