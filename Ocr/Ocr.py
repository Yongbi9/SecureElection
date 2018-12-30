import pytesseract
from PIL import Image
# pip3 install pytesseract
# sudo update
# sudo apt-get install tesseract-ocr


def Ocr(filename, BureauId, politicalPartyId, generateId, nb_candidats):
    path_img = 'Bureau'+str(BureauId)+'/'+filename
    textList = [elt for elt in pytesseract.image_to_string(Image.open(path_img)).split('\n') if not elt.replace(" ", "") == '']
    data = {}
    data['Bureau'] = " ".join(str(x) for x in textList[0].split(' ')[1:])
    data['Electeurs'] = textList[1].split(' ')[-1]
    data['Candidats'] = {}
    for i in range(3, 3 + nb_candidats):
        data['Candidats'][" ".join(str(x) for x in textList[i].split(' ')[:2])] = textList[i].split(' ')[-1]
    data['Candidats']['Bulletion null'] = textList[i + 1].split(' ')[-1]
    scrutineer = {}
    scrutineer['$class'] = "org.cloud.election.Scrutineer"
    scrutineer['scrutineerId'] = generateId
    scrutineer['politicalPartyId'] = politicalPartyId
    asset = {}
    asset['$class'] = "org.cloud.election.Report"
    asset['reportId'] = generateId
    asset['pollingStation'] = data['Bureau'].split(' ')[-1]
    asset['nbVoters'] = int(data['Electeurs'])
    asset['voices'] = [int(data['Candidats'][voice]) for voice in data['Candidats']]
    asset['owner'] = "resource:org.cloud.election.Scrutineer#"+str(generateId)
    return scrutineer, asset