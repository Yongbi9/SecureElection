const axios = require('axios')

module.exports = function (app) {
    var politician = require('../helpers/politician')
    var pollingStation = require('../helpers/pollingStation')
    var verification = require('../helpers/verification')

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
        axios.post('http://127.0.0.1:5000/api/report/generate', params)
        .then(response => {
            if(response.data.status==1){

            }
            else{
                
            }
        });
    })
    app.get;('/candidate', function(req, res){
        axios.get('http://localhost:3000/api/Politician')
        .then(response => {
            res.render('levelCandidat', {politicians:politician.removeNonePolitician(response)})
        });
    });
    app.get('/votePlace', function(req, res){
        axios.get('http://localhost:3000/api/PollingStation')
        .then(response => {
            res.render('levelVotePlace', {pollingStations:pollingStation.getPollingStations(response)})
        });
    });
    app.get('/verification', function(req, res){
        axios.get('http://localhost:3000/api/PollingStation')
        .then(response1 => {
            pollingStations = pollingStation.getPollingStations(response1)
            axios.get('http://localhost:3000/api/Report')
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
        axios.get('http://localhost:3000/api/queries/selectReportsByPoliticianAndPollingStation?politician=resource%3Aorg.cloud.election.Politician%230&pollingStation=resource%3Aorg.cloud.election.PollingStation%23'+id)
        .then(response => {
            res.json(verification.votersTruePvPlace(response, id))
        });
    });
    app.get('/results', function(req, res){
        axios.get('http://localhost:3000/api/Report')
        .then(response => {
            res.json(pollingStation.votersPoliticianResult(response))
        });
    });
    app.post('/resultsPlacesByPolitician', function(req, res){
        id = req.body.politicianId
        axios.get('http://localhost:3000/api/queries/selectReportsByPolitician?politician=resource%3Aorg.cloud.election.Politician%23'+id)
        .then(response => {
            res.json(politician.votersPolitician(response, id))
        });
    });
    app.post('/resultsPoliticiansByPlace', function(req, res){
        id = req.body.pollingStationId
        axios.get('http://localhost:3000/api/queries/selectReportByPollingStation?pollingStation=resource%3Aorg.cloud.election.PollingStation%23'+id)
        .then(response => {
            res.json(pollingStation.votersPoliticianPlace(response, id))
        });
    });
}