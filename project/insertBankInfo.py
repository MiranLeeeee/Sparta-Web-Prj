from pymongo import MongoClient

client = MongoClient(your connection information)
db = client.donworry

filePath = 'static/files/bank.txt'
f = open(filePath, 'r', encoding='UTF8')
line = f.readlines()

i = 3

while i < len(line):
    db.banks.insert_one({'name': line[i-3], 'website': line[i-2], 'tel': line[i-1], 'logo': line[i]})
    i = i+5

f.close()