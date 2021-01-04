from flask import Flask, render_template, jsonify, request
from pymongo import MongoClient

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

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)