from flask import Flask, render_template, request
import git

app = Flask(__name__)

@app.route('/')
def hello():
    return render_template('home.html')

@app.route('/update_server', methods=['POST'])
def webhook():
    if request.method == 'POST':
        repo = git.Repo(repo, search_parent_directories=True)
        origin = repo.remotes.origin
        origin.pull()
    else:
        return 'Wrong event type', 400

    return 'Updated PythonAnywhere successfully', 200
