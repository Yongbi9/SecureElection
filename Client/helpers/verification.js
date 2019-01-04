
function isEqual(voices1, voices2){
    if(voices1.length != voices2.length){
        return false
    }
    for(var i in voices1){
        if(voices1[i] != voices2[i]){
            return false
        }
    }
    return true
}

exports.votersTruePvPlace = function(data, id){
    var truePv = data.data[0]
    var nbVoters = truePv.nbVoters
    var res = []
    for(var voice in truePv.voices){
        var pv = {}
        if(voice == truePv.voices.length-1){
            pv = {
                'label':'Bulletin null',
                'value': ((truePv.voices[truePv.voices.length-1]+0.0) / nbVoters)*100
            }
        }
        else{
            pv = {
                'label':'Candidat'+(parseInt(voice)+1),
                'value': ((truePv.voices[voice]+0.0) / nbVoters)*100
            }
        }
        res.push(pv)
    }

    source = {
        // Chart Configuration
        "chart": {
            "caption": "Repartition des pourcentages dans le bureau"+id,
            "subCaption": "",
            //"xAxisName": "Bureaux de votes",
            //"yAxisName": "Nombre de voix",
            //"numberSuffix": "K",
            "theme": "fusion",
        },
        // Chart Data
        "data": res
    }
    return source
}

exports.verify = function(pollingStations, data){
    var arr = data.data
    var allPvs = {}
    for(var i in pollingStations){
        idPollingStation = pollingStations[i].pollingStationId
        var pvsPollingStation = {}
        for(var k in arr){
            var tmpIdPollingStation = arr[k].pollingStation.substring(arr[k].pollingStation.lastIndexOf("#")+1, arr[k].pollingStation.length)
            var tmpIdPolitician = arr[k].politician.substring(arr[k].politician.lastIndexOf("#")+1, arr[k].politician.length)
            if(idPollingStation == tmpIdPollingStation){
                pvsPollingStation[''+tmpIdPolitician] = arr[k].voices
            }
        }
        allPvs[''+idPollingStation] = pvsPollingStation
    }

    var res = {}
    var politicians = []
    var nbCandidates = arr[0].voices.length
    for(var i=0; i < nbCandidates; i++){
        if(i == nbCandidates-1){
            politicians.push("Elecam")
        }
        else{
            politicians.push(""+(i+1))
        }
    }
    res.politicians = politicians
    var pollingStations = []
    for(var i=0; i < nbCandidates; i++){
        var out = []
        for(var key in allPvs){
            if(i == nbCandidates-1){
                out.push(isEqual(allPvs[key]["0"], allPvs[key]["-2"]))
            }
            else{
                out.push(isEqual(allPvs[key]["0"], allPvs[key][""+(i+1)]))
            }
        }
        pollingStations.push(out)
    }
    res.pollingStations = pollingStations
    var labels = []
    for(var key in allPvs){
        labels.push(parseInt(key))
    }
    res.labels = labels
    return res
}