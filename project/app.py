from flask import Flask, render_template, jsonify, request
from pymongo import MongoClient
import hashlib

app = Flask(__name__)
client = MongoClient(your connection information)
db = client.donworry

@app.route('/')
def home():
    return render_template('home.html')

#정기예금 페이지(deposit)로 이동
@app.route('/deposit')
def deposit():
    return render_template('deposit.html')


#적금 페이지(savings)로 이동
@app.route('/savings')
def savings():
    return render_template('savings.html')


#이미 가입된 회원인지 확인
@app.route('/validUserId', methods=['POST'])
def validUserId():
    userId = request.form['id']
    result = db.member.find({'id': userId}).count()

    return jsonify({'result': 'success', 'countResult': result})

#회원 정보 삽입
@app.route('/insertMemberInfo', methods=['POST'])
def insertMemberInfo():
    name = request.form['name']
    email = request.form['email']
    gender = request.form['gender']
    birth = request.form['birth']
    userId = request.form['id']
    userPW = request.form['password']

    # 회원 비밀번호를 sha256 방법(단방향)으로 암호화
    pw_hash = hashlib.sha256(userPW.encode('utf-8')).hexdigest()
    db.member.insert({"name": name, "email": email, "gender": gender, "birth": birth, "id": userId, "password": pw_hash});

    return jsonify({'result': 'success'})

#입력한 아이디의 비밀번호가 일치하는지 확인
@app.route('/validUserPW', methods=['POST'])
def validUserPW():
    userId = request.form['id']
    userPW = request.form['password']

    pw_hash = hashlib.sha256(userPW.encode('utf-8')).hexdigest()
    result = db.member.find({'id': userId, 'password': pw_hash}).count()

    return jsonify({'result': 'success', 'countResult': result})

#은행 정보 가져오기
@app.route('/getBankNames', methods=['GET'])
def getBankNames():
    result = list(db.banks.find({}, {'_id': 0}))
    return jsonify({'result': 'success', 'banks': result})

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)