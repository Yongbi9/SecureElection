$(document).ready(function(){
    FusionCharts.ready(function(){
        $.ajax({
            url: "/results",
            type: "GET",
            dataType: "json",
            success: function(res){
                var fusioncharts = new FusionCharts({
                    type: "pie2D",
                    renderAt: 'chart-containerTotal',
                    width: '100%',
                    height: '70%',
                    dataFormat: 'json',
                    dataSource: res
                });
                fusioncharts.render();
            }
        });

        var selectInput = document.getElementById("chart");
        var pollingStationId = selectInput.options[selectInput.selectedIndex].value
        $.ajax({
            url: "/resultsPoliticiansByPlace",
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
            url: "/resultsPoliticiansByPlace",
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