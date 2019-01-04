from flask import Flask
from flask_restful import Api

from Helpers import deleteVotePlaceDirectory
from Roads import LoadResources

api = Flask('__name__')
app = Api(api)

LoadResources(app)

if __name__ == '__main__':
    deleteVotePlaceDirectory('./')
    api.run(host='127.0.0.1', port=5001, debug=True)