const axios = require('axios')


module.exports = function (app) {
    var politician = require('../helpers/politician')
    var pollingStation = require('../helpers/pollingStation')
    var verification = require('../helpers/verification')
    var host = "157.230.143.147"

    app.get('/', function (req, res) {
        res.render('accueil')
    });

    app.post('/launch', function(req, res){
        params = {
            nbInscrits: parseInt(req.body.nbInscrits),
            nbCandidats: parseInt(req.body.nbCandidats),
            nbBureaux: parseInt(req.body.nbBureaux),
            niveauFraude: parseInt(req.body.niveauFraude)
        }
        var hostG = "app_generator"

        axios.get('http://'+host+':3000/api/Politician')
        .then(response1 => {
            axios.get('http://'+host+':3000/api/PollingStation')
            .then(response2 => {
                axios.get('http://'+host+':3000/api/Scrutineer')
                .then(response3 => {
                    axios.get('http://'+host+':3000/api/Report')
                    .then(response4 => {
                        var politicianIds = response1.data.map(function(item){ return item.politicianId });
                        var pollingStationIds = response2.data.map(function(item){ return item.pollingStationId })
                        var scrutineerIds = response3.data.map(function(item){ return item.scrutineerId });
                        var reportIds = response4.data.map(function(item){ return item.reportId });

                        var deleteReport = function(i) {
                            if(i < reportIds.length) {
                                axios.delete('http://'+host+':3000/api/Report/'+reportIds[i]).then(function() {
                                    deleteReport(++i)
                                });
                            }
                            else{
                                console.log("suppression ok");
                                axios.post('http://'+hostG+'/api/report/generate', params)
                                .then(response5 => {
                                    res.redirect('/candidate');
                                });
                            }
                        }
                        var deleteScrutineer = function(i) {
                            if(i < scrutineerIds.length) {
                                axios.delete('http://'+host+':3000/api/Scrutineer/'+scrutineerIds[i]).then(function() {
                                    deleteScrutineer(++i)
                                });
                            }
                            else{
                                deleteReport(0)
                            }
                        }

                        var deletePollingStation = function(i) {
                            if(i < pollingStationIds.length) {
                                axios.delete('http://'+host+':3000/api/PollingStation/'+pollingStationIds[i]).then(function() {
                                    deletePollingStation(++i)
                                })
                            }
                            else{
                                deletePollingStation(0)
                            }
                        }

                        var deletePolitician = function(i) {
                            if(i < scrutineerIds.length) {
                                axios.delete('http://'+host+':3000/api/Politician/'+politicianIds[i]).then(function() {
                                    deletePolitician(++i)
                                })
                            }
                            else{
                                deletePollingStation(0)
                            }
                        }
                        deletePolitician(0);
                    });
                });
            });
        });
    });
    
    app.get('/candidate', function(req, res){
        axios.get('http://'+host+':3000/api/Politician')
        .then(response => {
            res.render('levelCandidat', {politicians:politician.removeNonePolitician(response)});
        });
    });
    app.get('/votePlace', function(req, res){
        axios.get('http://'+host+':3000/api/PollingStation')
        .then(response => {
            res.render('levelVotePlace', {pollingStations:pollingStation.getPollingStations(response)})
        });
    });
    app.get('/verification', function(req, res){
        axios.get('http://'+host+':3000/api/PollingStation')
        .then(response1 => {
            pollingStations = pollingStation.getPollingStations(response1)
            axios.get('http://'+host+':3000/api/Report')
            .then(response2 => {
                res.render('verification', {
                    data: verification.verify(pollingStations, response2),
                    pollingStations: pollingStations
                });
            });
        });
    });
    app.post('/resultsTrueReportByPlace', function(req, res){
        id = req.body.pollingStationId
        axios.get('http://'+host+':3000/api/queries/selectReportsByPoliticianAndPollingStation?politician=resource%3Aorg.cloud.election.Politician%230&pollingStation=resource%3Aorg.cloud.election.PollingStation%23'+id)
        .then(response => {
            res.json(verification.votersTruePvPlace(response, id))
        });
    });
    app.get('/results', function(req, res){
        axios.get('http://'+host+':3000/api/Report')
        .then(response => {
            res.json(pollingStation.votersPoliticianResult(response))
        });
    });
    app.post('/resultsPlacesByPolitician', function(req, res){
        id = req.body.politicianId
        axios.get('http://'+host+':3000/api/queries/selectReportsByPolitician?politician=resource%3Aorg.cloud.election.Politician%23'+id)
        .then(response => {
            res.json(politician.votersPolitician(response, id))
        });
    });
    app.post('/resultsPoliticiansByPlace', function(req, res){
        id = req.body.pollingStationId
        axios.get('http://'+host+':3000/api/queries/selectReportByPollingStation?pollingStation=resource%3Aorg.cloud.election.PollingStation%23'+id)
        .then(response => {
            res.json(pollingStation.votersPoliticianPlace(response, id))
        });
    });
}