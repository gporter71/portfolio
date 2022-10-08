from flask import Flask, request, render_template, redirect
from flask_mail import Mail, Message
import os
from dotenv import load_dotenv
#from signalwire.rest import Client as signalwire_client
import re
import git

load_dotenv()
app = Flask(__name__)

app.config['MAIL_SERVER']= os.getenv('MAIL_SERVER')
app.config['MAIL_PORT'] = os.getenv('MAIL_PORT')
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True

mail = Mail(app)

@app.route('/')
def hello():
    return render_template('index.html')

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

@app.route('/home')
def home():
    return hello()

@app.route('/projects')
def projects():
    return render_template('projects.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/contact_save', methods=["POST"])
def contact_save():
    return render_template('contact.html')

@app.route('/contact_send', methods=['POST'])
def contact_send():
    if request.method == "POST":
        name = request.form['name']
        phone = request.form['phone']
        email = request.form['email']
        message = request.form['message']

        msg = Message("Hey Gabriel", sender="bottyforscotty@gmail.com", recipients = ["gporter71@gmail.com"])
        body = "Hey Gabe, you got a new message on your website"
        body += "\n message is as follows: '" + message + "'"
        body += "\n Contact Info:"
        body += "\nName: " + name
        body += "\nPhone: " + phone
        body += "\nEmail: " + email

        msg.body = body
        mail.send(msg)
        return "Success"
    return "Failure"
