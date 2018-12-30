from flask import request
from flask_restful import Resource
from Ocr import *

import os, json


def LoadResources(app):
    app.add_resource(ParametersReport, '/api/ocr/parametersReport/<string:bureauId>/<string:politicalPartyId>/<string:generateId>/<string:nbCandidats>')


class ParametersReport(Resource):
    def put(self, bureauId, politicalPartyId, generateId, nbCandidats):
        file = request.files['file']
        dir = 'Bureau'+bureauId
        if not os.access(dir, os.F_OK):
            os.mkdir(dir)
        file.save(os.path.join(dir, file.filename))
        asset, scrutineer = Ocr(file.filename, bureauId, int(politicalPartyId), generateId, int(nbCandidats))

        #***************************************************************************************************#
        #                           Affichage temporairement dans la console                                #
        #***************************************************************************************************#
        print(json.dumps(asset, indent=4))
        print(json.dumps(scrutineer, indent=4))
        print('#***************************************************************************************************#')
        print('#                Formats json qui seront envoyés à l\'API hyperlegder                                #')
        print('#***************************************************************************************************#')