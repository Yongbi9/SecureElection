function calculateVotesCandidats (arr, nbInscrits){
    var res = 0.0
    for(var elt in arr){
        res += parseFloat(arr[elt].value)
    }
    return (res / nbInscrits)*100
}


exports.removeNonePolitician = function(data){
    var res = []
    var arr = data.data
    for(var politician in arr){
        if(arr[politician].politicianId != "0" && arr[politician].politicianId!="-1"){
            res.push(arr[politician])
        }
    }
    return res
}

exports.votersPolitician = function(data, id){
    var arr = data.data
    var nbInscrits = arr[0].nbInscrits
    var res = arr.map(report => {
        if(parseInt(id)>0){
            value = report.voices[parseInt(id)-1]
        }
        else{
            value = report.voices[report.voices.length-1]
        }
        return {
            'label':'Bureau'+report.pollingStation.substring(report.pollingStation.lastIndexOf("#")+1, report.pollingStation.length),
            'value':''+value
        };
    });
    var pourcentage = calculateVotesCandidats(res, nbInscrits)
    source = {
        // Chart Configuration
        "chart": {
            "caption": "Repartition des pourcentages pour le candidat"+id,
            "subCaption": pourcentage+"% des voix",
            "xAxisName": "Bureaux de votes",
            "yAxisName": "Nombre de voix",
            "numberSuffix": "",
            "theme": "fusion",
        },
        // Chart Data
        "data": res
    }
    return source;
}