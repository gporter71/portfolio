from flask import Flask, render_template, request
import git

app = Flask(__name__)

@app.route('/')
def hello():
    return render_template('home.html')

@app.route('/update_server', methods=['POST'])
def webhook():
    if request.method == 'POST':
        repo = git.Repo("/home/gporter71")
        origin = repo.remotes.origin
        repo.create_head('master', origin.refs.master).set_tracking_branch(origin.refs.master).checkout()
        origin.pull()
        return 'Updated PythonAnywhere successfully', 200
    else:
        return 'Wrong event type', 400
