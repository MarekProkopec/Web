#creates some sentences for the site

import json

with open('sentenceinput.txt', 'r') as f:
    text = f.read()
    text = text.replace('\n', '')
    textlist = text.split('. ')

    for item in textlist:
        while item.startswith(' '):
            item = item[1:]
        if item == "" or len(item) < 100:
            textlist.remove(item)

    for j in range(len(textlist)):
        if not textlist[j].endswith('.') or not textlist[j].endswith('?') or not textlist[j].endswith('!'):
            textlist[j] += '.'


    dictionary = {'sentences':textlist}
    with open('sentenceoutput.json', 'w+') as ff:
        ff.write('')
        json.dump(dictionary, ff)