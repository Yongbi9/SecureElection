from flask import send_file, request
from flask_restful import Resource

import PvsGenerator

def LoadResources(app):
    app.add_resource(GenerateReport, '/api/report/generate')
    app.add_resource(ImageReport, '/api/report/imageReport')


class GenerateReport(Resource):
    def post(self):
        data = request.get_json(cache=False)
        PvsGenerator.PvsGenerator(data['nbInscrits'], data['nbBureaux'], data['nbCandidats'], data['niveauFraude'])
        return dict(info='Génération réussie avec succès')


class ImageReport(Resource):
    def post(self):
        data = request.get_json(cache=False)
        url_image = data['label']+'.png'
        return send_file('Bureau'+str(data['idBureau'])+'/'+url_image, attachment_filename=url_image)