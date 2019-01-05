import os, random, shutil, requests

import imgkit
from jinja2 import Template
# pip install imgkit. then sudo apt-get install wkhtmltopdf
# pip install jinja2

hostOCR = "127.0.0.1:5001" #"app_ocr"


class PvsGenerator:
    # ******************************************************************************************#
    # ***********************************Le constructeur****************************************#
    # ******************************************************************************************#
    def __init__(self, nbInscrits, nbBureaux, nbCandidats, niveauFraude):
        self.nbInscrits = nbInscrits
        self.nbCandidats = nbCandidats
        self.niveauFraude = niveauFraude
        self.nbBureaux = nbBureaux
        self.groupsCoalition = []
        self.FZERO = 0
        self.FSOLITAIRE = 1
        self.FCOALITION = 2
        self.id = 0
        self.generatePVs()

    # *******************************************************************************************#
    # ***********************************Les fonctions principales*******************************#
    # *******************************************************************************************#
    def generatePVs(self):
        self.listeElecteurs = self.partition(self.nbInscrits, self.nbBureaux)
        self.pp = random.randint(1, self.nbCandidats)
        if self.niveauFraude == self.FZERO:
            self.generatePV_FZERO()
        elif self.niveauFraude == self.FSOLITAIRE:
            self.generatePV_FSOLITAIRE()
        else:
            self.generatePV_FCOALITION()

    def generatePV_FZERO(self):
        for idBureau in range(self.nbBureaux):
            pvVrai = self.generatePVVrai(idBureau + 1)
            self.registerPV(pvVrai, idBureau + 1, 'VRAI_PV', 0)
            for idCandidat in range(self.nbCandidats):
                if idCandidat + 1 == self.pp:
                    self.registerPV(pvVrai, idBureau + 1, 'Candidat' + str(idCandidat + 1) + "(PartiAuPouvoir)", idCandidat + 1)
                else:
                    self.registerPV(pvVrai, idBureau + 1, 'Candidat' + str(idCandidat + 1), idCandidat + 1)
            self.registerPV(pvVrai, idBureau + 1, 'Elecam', -1)
            self.registerPV(pvVrai, idBureau + 1, 'BulletinNul', -2)

    def generatePV_FSOLITAIRE(self):
        for idBureau in range(self.nbBureaux):
            pvVrai = self.generatePVVrai(idBureau + 1)
            self.registerPV(pvVrai, idBureau + 1, 'VRAI_PV', 0)
            pv_pp = {}
            for idCandidat in range(self.nbCandidats):
                fraude = self.generateBooleanForFraude()
                if fraude:
                    if idCandidat + 1 == self.pp:
                        pv_pp = self.generatePVFraude(pvVrai, idCandidat + 1, idBureau + 1)
                        self.registerPV(pv_pp, idBureau + 1, 'Candidat' + str(idCandidat + 1) + '(PartiAuPouvoir)', idCandidat + 1)
                    else:
                        self.registerPV(self.generatePVFraude(pvVrai, idCandidat + 1, idBureau + 1), idBureau + 1,
                                        'Candidat' + str(idCandidat + 1), idCandidat + 1)
                else:
                    if idCandidat + 1 == self.pp:
                        pv_pp = pvVrai
                        self.registerPV(pv_pp, idBureau + 1, 'Candidat' + str(idCandidat + 1) + '(PartiAuPouvoir)', idCandidat + 1)
                    else:
                        self.registerPV(pvVrai, idBureau + 1, 'Candidat' + str(idCandidat + 1), idCandidat + 1)
            self.registerPV(pv_pp, idBureau + 1, 'Elecam', -1)
            self.registerPV(pvVrai, idBureau + 1, 'BulletinNul', -2)

    def generatePV_FCOALITION(self):
        self.generateGroups()
        for idBureau in range(self.nbBureaux):
            pvVrai = self.generatePVVrai(idBureau + 1)
            self.registerPV(pvVrai, idBureau + 1, 'VRAI_PV', 0)
            pv_pp = {}
            for groupCoalition in self.groupsCoalition:
                representant = groupCoalition[0]
                group = groupCoalition[1]
                fraude = self.generateBooleanForFraude()
                if fraude:
                    pvFraude = self.generatePVFraude(pvVrai, representant, idBureau + 1)
                    for idCandidat in group:
                        if idCandidat == self.pp:
                            pv_pp = pvFraude
                            self.registerPV(pv_pp, idBureau + 1, 'Candidat' + str(idCandidat) + "(PartiAuPouvoir)", idCandidat)
                        else:
                            self.registerPV(pvFraude, idBureau + 1, 'Candidat' + str(idCandidat), idCandidat)
                else:
                    for idCandidat in group:
                        if idCandidat == self.pp:
                            pv_pp = pvVrai
                            self.registerPV(pv_pp, idBureau + 1, 'Candidat' + str(idCandidat) + "(PartiAuPouvoir)", idCandidat)
                        else:
                            self.registerPV(pvVrai, idBureau + 1, 'Candidat' + str(idCandidat), idCandidat)
            self.registerPV(pv_pp, idBureau + 1, 'Elecam', -1)
            self.registerPV(pvVrai, idBureau + 1, 'BulletinNul', -2)


    # *******************************************************************************************#
    # ***************Quelques fonctions d'ajout aidant les fonctions principales*****************#
    # *******************************************************************************************#
    def partition(self, number, parts):
        partitions = []
        reste = number
        for i in range(parts):
            if i == (parts - 1):
                partitions.append(reste)
            else:
                voix = random.randint(0, reste)
                reste -= voix
                partitions.append(voix)
        return partitions

    def generatePVVrai(self, idBureau):
        pv = {}
        listeVoix = self.partition(self.listeElecteurs[idBureau - 1], self.nbCandidats + 1)
        pv['Electeurs'] = self.listeElecteurs[idBureau - 1]
        pv['Voix'] = listeVoix
        pv['Bureau'] = 'Bureau ' + str(idBureau)
        return pv

    def generatePVFraude(self, pvVrai, idCandidat, idBureau):
        pv = {}
        k = 0
        max = 0
        listeVoix = pvVrai['Voix'].copy()
        for i in range(len(listeVoix)):
            if max < listeVoix[i]:
                max = listeVoix[i]
                k = i
        if not (k == idCandidat):
            listeVoix[k] = listeVoix[idCandidat]
            listeVoix[idCandidat] = max
        pv['Electeurs'] = self.listeElecteurs[idBureau - 1]
        pv['Voix'] = listeVoix
        pv['Bureau'] = 'Bureau ' + str(idBureau)
        return pv

    def generateBooleanForFraude(self):
        if random.randint(0, 1) == 1:
            return True
        return False

    def generateGroups(self):
        listeGroups = []
        listeIdCandidatsRestants = [i + 1 for i in range(self.nbCandidats)]
        reste = self.nbCandidats
        partis = 1
        if reste - 1 > 1:
            partis = random.randint(2, reste - 1)
        while not reste == 0:
            random.shuffle(listeIdCandidatsRestants)
            group = listeIdCandidatsRestants[:partis]
            del listeIdCandidatsRestants[:partis]
            representant = group[random.randint(0, len(group) - 1)]
            listeGroups.append([representant, group])
            reste = len(listeIdCandidatsRestants)
            if not reste == 0:
                partis = random.randint(1, reste)
        self.groupsCoalition = listeGroups

    def saveAsImage(self, pv, idBureau, label):
        path = 'Bureau' + str(idBureau) + '/' + label + '.png'
        tmpl = Template(u'''\
                    <!DOCTYPE html>
                    <html>
                    <head>
                    <meta charset="utf-8">
                    <style>
                    body {
                        font-size: 20px;
                    }
                    table, td, th {
                        border: 1px solid black;
                        margin-top: 20px;
                        padding-left: 10px;
                    }
                    td {
                      width: 50%;
                    }
                    table {
                        border-collapse: collapse;
                        width: 100%;
                    }
                    th {
                        text-align: left;
                    }
                    </style>
                    </head>
                    <body>
                        <table>
                          <tr>
                            <td>Bureau</td>
                            <td>{{ nomBureau }}</td>
                          </tr>
                          <tr>
                            <td>Electeurs</td>
                            <td>{{ voixElecteurs }}</td>
                          </tr>
                        </table>
                        <table>
                          <tr>
                            <th>Candidats</th>
                            <th>Voix</th>
                          </tr>
                          {%- for elt in candidats %}
                          <tr>
                            <td>{{ elt[0] }}</td>
                            <td>{{ elt[1] }}</td>
                          </tr>
                          {%- endfor %}
                          <tr>
                            <td>Bulletin null</td>
                            <td>{{ voixBulletinNull }}</td>
                          </tr>
                        </table>
                        <table>
                          <tr>
                            <th>Scrutateurs</th>
                            <th>Signatures</th>
                          </tr>
                          {%- for elt in scrutateurs %}
                          <tr>
                            <td>{{ elt[0] }}</td>
                            <td>{{ elt[1] }}</td>
                          </tr>
                          {%- endfor %}
                          <tr>
                            <td> Représentant de Elecam </td>
                            <td> Elecam </td>
                          </tr>
                        </table>
                    </body>
                    </html>
                ''')
        nomBureau = pv['Bureau']
        voixElecteurs = pv['Electeurs']
        candidats = []
        scrutateurs = []
        voixBulletinNull = 0
        i = 1
        for voix in pv['Voix']:
            if not i == len(pv['Voix']):
                candidats.append(['Candidat ' + str(i), voix])
                scrutateurs.append(['Scrutateur ' + str(i), 'Candidat ' + str(i)])
            else:
                voixBulletinNull = voix
            i += 1
        options = {"xvfb": ""}
        imgkit.from_string(tmpl.render(nomBureau=nomBureau, voixElecteurs=voixElecteurs, candidats=candidats, voixBulletinNull=voixBulletinNull, scrutateurs=scrutateurs), 
                          path,
                          options=options)

    def registerPV(self, pv, idBureau, label, politicalPartyId):
        directory = 'Bureau' + str(idBureau)
        if not os.access(directory, os.F_OK):
            os.mkdir(directory)
        else:
            if os.access(directory + '/BulletinNul.png', os.F_OK):
                shutil.rmtree(directory)
                os.mkdir(directory)
        self.saveAsImage(pv, idBureau, label)
        self.id += 1
        requests.put(url='http://'+hostOCR+'/api/ocr/parametersReport/'+ str(idBureau)+'/'+str(politicalPartyId)+'/'+str(self.id)+'/'+str(self.nbCandidats)+'/'+str(self.nbInscrits),
                     files={'file': open('Bureau'+str(idBureau)+'/'+label+'.png', 'rb')})
                    