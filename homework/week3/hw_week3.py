import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient

'''
* homework(week3)
1. 지니뮤직의 1~50위 곡의 정보를 스크래핑(순위, 곡 제목, 가수)
2. python 내장 함수 strip() 활용
3. 스크래핑 결과를 mongoDB에 저장
'''

client = MongoClient('localhost', 27017)
db = client.dbsparta

headers = {'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
data = requests.get('https://www.genie.co.kr/chart/top200?ditc=D&rtm=N&ymd=20200713',headers=headers)
soup = BeautifulSoup(data.text, 'html.parser')

trs = soup.select('#body-content > div.newest-list > div > table > tbody > tr')

#strip() : 문자열 기준 좌우의 공백 등을 제거 (문자열함수)
for tr in trs:
   rank = tr.select_one('td.number').text
   title = tr.select_one('td.info > a.title.ellipsis').text
   artist = tr.select_one('td.info > a.artist.ellipsis').text
   #print(rank[0:2].strip(), title.strip(), artist)
   db.musicchart.insert_one({'rank': rank[0:2].strip(), 'title': title.strip(), 'artist': artist})

'''
all_songs = list(db.musicchart.find({}))
for song in all_songs:
    print(song)
'''



