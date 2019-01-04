$(document).ready(function(){
    FusionCharts.ready(function(){
        $("#loaderImage").show()
        var selectInput = document.getElementById("chart");
        var outgoingId = selectInput.options[selectInput.selectedIndex].value
        $.ajax({
            url: "/resultsPlacesByPolitician",
            type: "POST",
            data: {politicianId : outgoingId},
            dataType: "json",
            success: function(res){
                FusionCharts.ready(function(){
                    var fusioncharts = new FusionCharts({
                        type: 'column2D',
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
    })
    
    function chart(){
        var politicianId = $("#chart").val();
        $("#loaderImage").show()
        $.ajax({
            url: "/resultsPlacesByPolitician",
            type: "POST",
            data: {politicianId : politicianId},
            dataType: "json",
            success: function(res){
                FusionCharts.ready(function(){
                    var fusioncharts = new FusionCharts({
                        type: 'column2D',
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
