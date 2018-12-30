import os, shutil


def deleteVotePlaceDirectory(path):
    for element in os.listdir(path):
        if os.path.exists(path+element+'/') and element.__contains__('Bureau'):
            shutil.rmtree(path+element)