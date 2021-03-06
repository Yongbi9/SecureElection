from flask import request
from flask_restful import Resource
from Ocr import *
import os, json, requests
from Config import getHost

#hostH = "157.230.143.147" #"fabric_servers" #"localhost" #"157.230.143.147"

def LoadResources(app):
    app.add_resource(ParametersReport, '/api/ocr/parametersReport/<string:bureauId>/<string:politicalPartyId>/<string:generateId>/<string:nbCandidats>/<int:nbInscrits>')


class ParametersReport(Resource):
    def put(self, bureauId, politicalPartyId, generateId, nbCandidats, nbInscrits):
        file = request.files['file']
        dir = 'Bureau'+bureauId
        if not os.access(dir, os.F_OK):
            os.mkdir(dir)
        file.save(os.path.join(dir, file.filename))
        politician, pollingStation, scrutineer, report = Ocr(file.filename, bureauId, int(politicalPartyId), generateId, int(nbCandidats), int(nbInscrits))
        response1 = requests.post(url="http://"+getHost()+":3000/api/Politician", json=politician).json()
        response2 = requests.post(url="http://"+getHost()+":3000/api/PollingStation", json=pollingStation).json()
        response3 = requests.post(url="http://"+getHost()+":3000/api/Scrutineer", json=scrutineer).json()
        response4 = requests.post(url="http://"+getHost()+":3000/api/Report", json=report).json()
