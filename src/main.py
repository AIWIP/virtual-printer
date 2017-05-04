
from flask import Flask
import pysnmp

app = Flask(__name__, static_url_path='')

@app.route("/")
def index():
    return app.send_static_file('index.html')

if __name__ == "__main__":
    app.run()