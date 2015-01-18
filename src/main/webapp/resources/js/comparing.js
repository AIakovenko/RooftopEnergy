/**
 * Created by Владислав on 17.01.2015.
 */

var myCompany;
var restUrl = '/rest/comparing/production';

function ajaxGetCompanyName() {
    $.ajax({
        type: 'get',
        url: "/rest/boxData/getUserDescription",
        crossDomain: true,
        error: function (data) {
            $('#main').html(data.responseText);
        },
        statusCode: {
            200: function (data) {
               myCompany = data.company;
            }
        },
        complete: function(jqXHR,textStatus) {
            allDateButtons(restUrl);
        }
    });
}

$(function(){
    currentPage.name = 'Comparing';

    //ajaxGetCompanyName();

});

function allDateButtons(url1){
    var i = 0;
    var pickerDate = new Date();
    var season = 1;

    var buttonStyles = function(buttId){
        $("#period button").css({'background-color': '#108F38', 'color': '#fffffe'});
        $("#"+buttId).css({'background-color': '#fffff0', 'color': '#108F38'});
    };

    $( "#datepicker" ).datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: "dd-mm-yy"

    });
    $("#datepicker").datepicker("setDate", "dd-mm-yy");
    var k = $.datepicker.formatDate("dd-mm-yy", new Date());
    $( "#datepicker").text(k);

    var picButtons = function(){
        var r = $("#datepicker").datepicker("getDate");
        console.log(r);
        var hour = 23;
        var minutes = 59;
        var sec = 59;
        var year = r.getFullYear();
        var month = r.getMonth();
        var day = r.getDate();
        pickerDate = new Date(year, month, day, hour, minutes, sec);
    };

    var buttonClicker = function(url1, x, d){
        var date = new Date();
        switch(x){
            case 0:
                url1 = url1+"/totally";
                break;
            case 1:
                url1 = url1+"/daily";
                break;
            case 2:
                url1 = url1+"/monthly";
                break;
            case 3:
                url1 = url1+"/yearly";
                break;
            default :
        }
        ajaxGraphQuery(url1,'Rooftop',pickerDate);
    };


    buttonClicker(url1,1,pickerDate);



    $("#day").click(function() {
        buttonStyles(this.id);
        season = 1;
        buttonClicker(url1, season,pickerDate);

    });

    $("#month").click(function(){
        buttonStyles(this.id);
        season = 2;
        buttonClicker(url1,season,pickerDate);

    });

    $("#year").click(function(){
        buttonStyles(this.id);
        season = 3;
        buttonClicker(url1,season,pickerDate);
    });

    $("#total").click(function(){
        buttonStyles(this.id);
        season = 0;
        buttonClicker(url1, season, pickerDate);

    });

    $("#datepicker").change(function(){
        picButtons();
        buttonClicker(url1, season ,pickerDate);
    });

}

function ajaxGraphQuery(strUrl1,companyName,endDate) {
    $.ajax({
            type: 'post',
            url: strUrl1,
            crossDomain: true,
            data: { 'companyName':myCompany,
                    'date': endDate.getTime()},
            error: function (data1) {
                $('#main').html(data1.responseText);
            },
            statusCode: {
                200: function (data1) {
                    $.ajax({
                        type: 'post',
                        url: strUrl1,
                        crossDomain: true,
                        data: { 'companyName':companyName,
                            'date': endDate.getTime()},
                        error: function (data2) {
                            $('#main').html(data2.responseText);
                        },
                        statusCode: {
                            200: function (data2) {
                                graph(data1,data2);
                            }
                        }
                    })
                }
            }
        }




    );
}

function graph (data1,data2) {
    var arr1 = new Array();
    for (i in data1) {
        arr1[i] =  [data1[i]["date"], data1[i]["value"]/1000];
    }
    var arr2 = new Array();
    for (i in data2) {
        arr2[i] =  [data2[i]["date"], data2[i]["value"]/1000];
    }

    Highcharts.setOptions({
        global: {
            useUTC: false

        },
        colors: ['#59AC28','#DC143C']

    });


    $('main').highcharts({

        chart: {
            type: 'column',
            zoomType: 'x',
            borderWidth: 1,
            borderColor: '#108f38',
            marginRight: 15
        },
        title: {
            text: 'Comparing data'
        },
        credits: {
            enabled: false
        },

        xAxis: {
            type: 'datetime',
            minRange:  3600*1000

        },
        yAxis: {
            title: {
                text: 'Energy (KWh)'

            }
        },
        legend: {
            enabled: true
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.75).get('rgba')]

                    ]
                },
                marker: {
                    radius: 1
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },

        series: [{
            name: myCompany,
            pointInterval:  3600 * 1000,
            data: arr1


        },{
            name: 'another company',
            pointInterval:  3600 * 1000,
            data: arr2

        }]
    });
}
