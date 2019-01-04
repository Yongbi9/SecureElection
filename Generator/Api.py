from flask import Flask
from flask_restful import Api

from Helpers import deleteVotePlaceDirectory
from Roads import LoadResources

host = "157.230.143.147"

api = Flask('__name__')
app = Api(api)

LoadResources(app)
if __name__ == '__main__':
    deleteVotePlaceDirectory('./')
    api.run(host=host, port=5000, debug=True)