from flask import Flask
from flask_restful import Api

from Helpers import deleteVotePlaceDirectory
from Roads import LoadResources
from Config import *

api = Flask('__name__')
app = Api(api)

LoadResources(app)

if __name__ == '__main__':
    deleteVotePlaceDirectory('./')
    api.run(debug=True, host=host, port=port)