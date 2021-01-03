from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/deposit')
def deposit():
    return render_template('deposit.html')

@app.route('/savings')
def savings():
    return render_template('savings.html')

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)