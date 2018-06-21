$(function () {
    var url1 = 'http://47.100.236.14/api/index/get?indexType=1&period=',
        url2 = 'http://47.100.236.14/api/index/get?indexType=2&period=';
    Highcharts.setOptions({
        global: {
            timezoneOffset: -8 * 60     //Highchart 时区偏移问题解决。
        },
        colors: ['rgba(215,221,236,.7)', '#fff']
    });
    //loading
    function chartLoading(className) {
        $('<div></div>').addClass('loading').css({
            textAlign:'center',
            position:'absolute',
            top:'45%',
            left:'50%',
            width:'100px',
            height:'50px',
            background:'url(images/loading.gif) no-repeat',
            backgroundSize:'contain',
            zIndex:9999
        }).prependTo($("."+className))
    }
    var flags = true;//第一次获取数据
    function NewIndex(resultData) {
        if (!flags) {
            $('.MI_indexBox').html('');
        }
        flags = false;//不是第一次获取数据了,因为已经获取过了
        var latestValue = resultData.latestValue;
        var changeValue = resultData.changeValue;
        var changePercent = resultData.changePercent;
        var isPositive = resultData.isPositive;
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
    }
  var btcPrices = [];
  var ethPrices = [];
  function BtcClick(resultData,num) {
      var indexValue = resultData.indexValue;
      $("#BTC").click(function () {
          if ($(this).is(":checked")) {
              btcPrices = resultData.btcPrice;
              dpc(indexValue,btcPrices,ethPrices,num);
          } else {
              btcPrices = [];
              dpc(indexValue,btcPrices,ethPrices,num);
          }
      });
  }
  function EthClick(resultData,num) {
      var indexValue = resultData.indexValue;
      $('#ETH').click(function () {
          if ($(this).is(":checked")) {
              ethPrices = resultData.ethPrice;
              dpc(indexValue,btcPrices,ethPrices,num);
          } else {
              ethPrices = [];
              dpc(indexValue,btcPrices,ethPrices,num);
          }
      });
  }
    periodAjax(0);
    function periodAjax(num) {
        $.ajax({
            url: url2 + num,
            type: 'GET',
            cache: false,
            dataType: 'json',
            data: {},
            beforeSend: function () {
                chartLoading('DPCBox');
            },
            complete: function () {
                $(".loading").remove();
            },
            success: function (result) {
                var resultData = result.data;
                if(result.code == '2'){
                    $('#MIChartBox').css({
                        textAlign:'center',
                        fontSize:'30px',
                        fontWeight:'border',
                        paddingTop: '200px'
                    }).html(result.message);
                    $(".loading").remove();
                }
                var indexValue = resultData.indexValue;
                    NewIndex(resultData);
                    BtcClick(resultData,num);
                    EthClick(resultData,num);
                    if ($("#BTC").is(":checked")){
                        btcPrices = result.data.btcPrice;
                        dpc(indexValue,btcPrices,ethPrices,num);
                    }
                    if ($("#ETH").is(":checked")){
                        ethPrices = result.data.ethPrice;
                        dpc(indexValue,btcPrices,ethPrices,num);
                    }
                dpc(indexValue,btcPrices,ethPrices,num)
            }
        })
    }
    var indexNum = 0;
    function dpc(indexValue,btcPrices,ethPrices,num) {
        // var num = JSON.stringify(_num);
        // console.log(num);
        // debugger
        $('#MIChartBox').highcharts('StockChart',
            {
                chart: {
                    type: 'line'
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
                    }
                 /*   areaspline: {
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
                    }*/
                },
                xAxis: {
                    type: 'datetime',
                    showLastLabel: true,
                    // minTickInterval: 10,
                    tickPixelInterval:75,
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
                        // tickInterval:2,
                        tickPixelInterval:50,
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
                        tickPixelInterval:50,
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
                        tickPixelInterval:50,
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
                            type: 'all',
                            count: 1,
                            text: '12h'
                        },
                        {
                            type: 'all',
                            count: 1,
                            text: '1D'
                        }, {
                            type: 'all',
                            count: 1,
                            text: '1W'
                        },
                        {
                            type: 'all',
                            count: 1,
                            text: '1M'
                        },
                        {
                            type: 'all',
                            count: 1,
                            text: 'All'
                        }],
                    selected: num,  //时间选择按钮的第几个按钮（下标）
                    inputEnabled: true,   //时间选择范围开启/关闭
                    inputBoxWidth: 95,
                    inputBoxBorderColor: 'none', //隐藏时间范围的颜色，可隐藏边框
                    labelStyle: {
                        color: 'rgba(59,59,73,.5)'
                    },
                    buttonTheme: { // styles for the buttons
                        fill: '#f7f7f7',
                        stroke: 'none',
                        'stroke-width': 0,
                        r: 2,
                        style: {
                            color: '#333'
                        },
                        states: {
                            select: {
                                fill: '#e6ebf5',
                                style: {
                                    color: '#000',
                                    fontWeight: 'bold'
                                }
                            },
                            disabled: {
                                fill: '#f7f7f7',
                                style: {
                                    color: '#333'
                                }
                            },
                            hover: {
                                fill: '#e6e6e6',
                                style: {
                                    color: '#333'
                                }
                            }
                        }
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
                        lineColor: '#22AAE1',
                        color: '#22AAE1'
                    }, {
                        name: 'BTC',
                        data: btcPrices,
                        tooltip: {
                            valuePrefix: '$',
                            valueSuffix: ' USD'
                        },
                        threshold: null,
                        yAxis: 1,
                        lineColor: '#F0B75A',
                        color: '#F0B75A',
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
                        lineColor: '#9CA3C0',
                        color: '#9CA3C0',
                        fillColor: 'transparent'
                    }
                    /*  {
                     type:'flags',  //标记点
                     data:[{}]
                     }*/
                ]
            }, function (chart) {
                var dataBtn = chart.rangeSelector.buttons;

                for (var i = 0; i < dataBtn.length; i++) {
                    dataBtn[i].on('click', function () {
                        indexNum = $(this).index() -1;
                        // console.log(indexNum);
                        if ($(this).text() == '12h') {
                            periodAjax(indexNum);
                        }
                        if ($(this).text() == '1D') {
                            periodAjax(indexNum);
                        }else if($(this).text() == '1W'){
                            periodAjax(indexNum);
                        }
                        else if($(this).text() == '1M'){
                            periodAjax(indexNum);
                        }
                      else if($(this).text() == 'All'){
                            periodAjax(indexNum);
                        }
                    })
                }
            });
    }
    //5分钟刷新一次图表---> 此方式需修改
    setInterval(function(){periodAjax(indexNum)},300000);
//------------------------------------------------------------------------
    //BVIX  一开始先加载一次数据
    var flag = true;//第一次获取数据
    function BVIXIndex(resultData) {
        if (!flag) {
            $('.indexBox').html('');
        }
        flag = false;//不是第一次获取数据了,因为已经获取过了
        var latestValue = resultData.latestValue;
        var changeValue = resultData.changeValue;
        var changePercent = resultData.changePercent;
        var isPositive = resultData.isPositive;
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
    }
    periodBVIX(0);
    function periodBVIX(num) {
        $.ajax({
            url: url1 + num,
            type: 'GET',
            cache: false,
            dataType: 'json',
            data: {},
            beforeSend: function () {
                chartLoading('BVIX_box');
            },
            complete: function () {
                $(".loading").remove();
            },
            success: function (result) {
                if(result.code == '2'){
                    $('#BVIXChartBox').css({
                        textAlign:'center',
                        fontSize:'30px',
                        fontWeight:'border',
                        paddingTop: '200px'
                    }).html(result.message);
                    $(".loading").remove();
                }
                var resultData = result.data;
                var indexValue = resultData.indexValue;
                BVIXIndex(resultData);
                BVIX(indexValue,num)
            }
        })
    }
    var BVIXNum = 0;
    function BVIX(indexValue,selectNum) {
        $('#BVIXChartBox').highcharts('StockChart',
            {
                chart: {
                    type: 'line'
                },
                // legend: {           //图例
                //     enabled: true,
                //     align: 'center',
                //     verticalAlign: 'bottom',
                //     shadow: false
                // },
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
                    }
             /*       areaspline: {
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
                    }*/
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
                        // tickAmount:6,        //Y轴刻度线数
                        opposite: false,
                        allowDecimals:false,  //是否在坐标轴标签中显示小数
                        // tickInterval:2,
                        // tickPixelInterval:50,
                        title: {
                            text: null
                        },
                        labels: {
                            enabled:true
                        }
                    }
                    /*{
                        type:'linear',
                        tickAmount:6,        //Y轴刻度线数
//                                    opposite: false,
//                                    allowDecimals:false,
//                                     tickInterval:1,
//                         tickPixelInterval:50,
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
//                         tickPixelInterval:50,
                        title: {
                            text: null
                        },
                        labels: {
                            enabled:false
                        }
                    }*/
                ],
                rangeSelector: {
                    buttons: [
                        {
                            type: 'all',
                            count: 1,
                            text: '12h'
                        },
                        {
                            type: 'all',
                            count: 1,
                            text: '1D'
                        }, {
                            type: 'all',
                            count: 1,
                            text: '1W'
                        },
                        {
                            type: 'all',
                            count: 1,
                            text: '1M'
                        },
                        {
                            type: 'all',
                            count: 1,
                            text: 'All'
                        }],
                    selected: selectNum,  //时间选择按钮的第几个按钮（下标）
                    inputEnabled: true,   //时间选择范围开启/关闭
                    inputBoxWidth: 95,
                    inputBoxBorderColor: 'none', //隐藏时间范围的颜色，可隐藏边框
                    labelStyle: {
                        color: 'rgba(59,59,73,.5)'
                    },
                    buttonTheme: { // styles for the buttons
                        fill: '#f7f7f7',
                        stroke: 'none',
                        'stroke-width': 0,
                        r: 2,
                        style: {
                            color: '#333'
                        },
                        states: {
                            select: {
                                fill: '#e6ebf5',
                                style: {
                                    color: '#000',
                                    fontWeight: 'bold'
                                }
                            },
                            disabled: {
                                fill: '#f7f7f7',
                                style: {
                                    color: '#333'
                                }
                            },
                            hover: {
                                fill: '#e6e6e6',
                                style: {
                                    color: '#333'
                                }
                            }
                        }
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
                        name: 'BVIX',
                        data: indexValue,
                        threshold: null,
                        yAxis: 0,
                        lineColor: '#22AAE1',
                        color: '#22AAE1'
                    }
                   /* {
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
                    }*/
                    /*  {
                     type:'flags',  //标记点
                     data:[{}]
                     }*/
                ]
            }, function (chart) {
                var dataBtn = chart.rangeSelector.buttons;
                for (var i = 0; i < dataBtn.length; i++) {
                    dataBtn[i].on('click', function () {
                        BVIXNum = $(this).index()-1;
                        if ($(this).text() == '12h') {
                            periodBVIX(BVIXNum);
                        }
                        else if ($(this).text() == '1D') {
                            periodBVIX(BVIXNum);
                        }else if($(this).text() == '1W'){
                            periodBVIX(BVIXNum)
                        }
                          else if($(this).text() == '1M'){
                            periodBVIX(BVIXNum)
                         }
                        else if($(this).text() == 'All'){
                            periodBVIX(BVIXNum)
                        }
                    })
                }
            });
    }
    setInterval(function(){periodBVIX(BVIXNum)},1200000);
});
