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

function checkMaxPv(data){
    var idMaj = 0;
    var idElecam;
    var count = 0
    for(var i in data){
        var tmpCount = 0;
        var id = data[i].politician.substring(data[i].politician.lastIndexOf("#")+1, data[i].politician.length)
        if(id!="-2" && id!="0"){
            for(var j = parseInt(i) + 1; j < data.length; j++){
                if(isEqual(data[i].voices, data[j].voices)){
                    tmpCount += 1
                }
            }
            if(tmpCount > count){
                count = tmpCount;
                idMaj = i
            }
        }
        if(id=="-1"){
            idElecam = i
        }
    }
    if(count == 1){
        return data[idElecam]
    }
    return data[idMaj]
}


exports.getPollingStations = function(data){
    return data.data
}

exports.votersPoliticianResult = function(data){
    var arr = data.data
    var nbInscrits = arr[0].nbInscrits
    var participants = arr[0].voices
    var arrGroupByPollingStation = {}
    var res = []
    for(var i in arr){
        var tmp = arr[i].pollingStation.substring(arr[i].pollingStation.lastIndexOf("#")+1, arr[i].pollingStation.length)
        if(arrGroupByPollingStation[tmp]){
            arrGroupByPollingStation.tmp.push(arr[i])
        }
        else{
            arrGroupByPollingStation.tmp = []
            arrGroupByPollingStation.tmp.push(arr[i])
        }
    }
    var tabMajPvs = []
    for(var key in arrGroupByPollingStation){
        tabMajPvs.push(checkMaxPv(arrGroupByPollingStation[key]))
    }
    for(var k in participants){
        var voix = 0.0;
        var pv = {}
        if(k==participants.length-1){
            for(var l in tabMajPvs){
                voix += tabMajPvs[l].voices[k]
            }
            pv = {
                'label':'Bulletin null',
                'value': (voix / nbInscrits)*100
            }
        }
        else{
            for(var l in tabMajPvs){
                voix += tabMajPvs[l].voices[k]
            }
            pv = {
                'label':'Candidat'+(parseInt(k)+1),
                'value': (voix / nbInscrits)*100
            }
        }
        res.push(pv)
    }
    source = {
        // Chart Configuration
        "chart": {
            "caption": "Repartition des pourcentages dans tout le territoire",
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

exports.votersPoliticianPlace = function(data, id){
    var arr = data.data
    var truePv = checkMaxPv(arr)
    var nbVoters = truePv.nbVoters
    var res = []
    for(var voice in truePv.voices){
        var pv = {}
        if(voice == truePv.voices.length-1){
            pv = {
                'label':'Bulletin null',
                'value': (truePv.voices[truePv.voices.length-1]+0.0) / nbVoters
            }
        }
        else{
            pv = {
                'label':'Candidat'+(parseInt(voice)+1),
                'value': (truePv.voices[voice]+0.0) / nbVoters
            }
        }
        res.push(pv)
    }
    source = {
        // Chart Configuration
        "chart": {
            "caption": "Repartition des pourcentages réelles dans le bureau"+id,
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
