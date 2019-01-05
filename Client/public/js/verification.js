$(document).ready(function(){
    FusionCharts.ready(function(){
        var selectInput = document.getElementById("chart");
        var pollingStationId = selectInput.options[selectInput.selectedIndex].value
        $.ajax({
            url: "/resultsTrueReportByPlace",
            type: "POST",
            data: {pollingStationId : pollingStationId},
            dataType: "json",
            success: function(res){
                FusionCharts.ready(function(){
                    var fusioncharts = new FusionCharts({
                        type: 'pie2D',
                        renderAt: 'chart-container',
                        width: '100%',
                        height: '70%',
                        dataFormat: 'json',
                        dataSource: res
                    });
                    fusioncharts.render();
                });
            }
        });
    });


    function chart(){
        var pollingStationId = $("#chart").val();
        $.ajax({
            url: "/resultsTrueReportByPlace",
            type: "POST",
            data: {pollingStationId : pollingStationId},
            dataType: "json",
            success: function(res){
                FusionCharts.ready(function(){
                    var fusioncharts = new FusionCharts({
                        type: 'pie2D',
                        renderAt: 'chart-container',
                        width: '100%',
                        height: '70%',
                        dataFormat: 'json',
                        dataSource: res
                    });
                    fusioncharts.render();
                });
            }
        });
    }
    $("#chart").on("change", chart);
})