import pytesseract
from PIL import Image
import re

# pip3 install pytesseract
# sudo update
# sudo apt-get install tesseract-ocr


def Ocr(filename, BureauId, politicalPartyId, generateId, nb_candidats, nbInscrits):
    path_img = 'Bureau'+str(BureauId)+'/'+filename
    textList = [elt for elt in pytesseract.image_to_string(Image.open(path_img)).split('\n') if not elt.replace(" ", "") == '']
    data = {}
    data['Bureau'] = " ".join(str(x) for x in textList[0].split(' ')[1:])
    data['Electeurs'] = textList[1].split(' ')[-1]
    data['Candidats'] = {}
    for i in range(3, 3 + nb_candidats):
        data['Candidats'][" ".join(str(x) for x in textList[i].split(' ')[:2])] = textList[i].split(' ')[-1]
    data['Candidats']['Bulletin null'] = textList[i + 1].split(' ')[-1]
    if politicalPartyId == 0:
        politicianName = 'VraiPv'
    elif politicalPartyId == -1:
        politicianName = 'Elecam'
    elif politicalPartyId == -2:
        politicianName = 'BulletinNul'
    else:
        politicianName = 'Candidat'+str(politicalPartyId)
    politician = {
        "$class": "org.cloud.election.Politician",
        "politicianId": str(politicalPartyId),
        "politicianName": politicianName,
    }
    pollingStation = {
        "$class": "org.cloud.election.PollingStation",
        "pollingStationId": str(BureauId),
        "pollingStationName": 'Bureau'+str(BureauId)
    }
    scrutineer = {
          "$class": "org.cloud.election.Scrutineer",
          "scrutineerId": generateId,
          "politician": "resource:org.cloud.election.Politician#"+str(politicalPartyId),
          "pollingStation": "resource:org.cloud.election.PollingStation#"+str(BureauId),
    }
    report = {
          "$class": "org.cloud.election.Report",
          "repordId": generateId,
          "nbVoters": int(data['Electeurs']),
          "nbInscrits": nbInscrits,
          "voices": [re.sub(r'[^0-9]+', "", data['Candidats'][voice]) for voice in data['Candidats']],
          "pollingStation": "resource:org.cloud.election.PollingStation#"+str(BureauId),
          "scrutineer": "resource:org.cloud.election.Scrutineer#"+generateId,
          "politician": "resource:org.cloud.election.Politician#"+str(politicalPartyId),
    }
    return politician, pollingStation, scrutineer, report