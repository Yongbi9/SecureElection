$(document).ready(function(){
    FusionCharts.ready(function(){
        $("#loaderImage").show()
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
                $("#loaderImage").hide()
            }
        });

        var selectInput = document.getElementById("chart");
        var pollingStationId = selectInput.options[selectInput.selectedIndex].value
        $("#loaderImage").show()
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
                $("#loaderImage").hide()
            }
        });
    });


    function chart(){
        var pollingStationId = $("#chart").val();
        $("#loaderImage").show()
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
                $("#loaderImage").hide()
            }
        });
    }
    $("#chart").on("change", chart);
})