import os
from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config.from_object(os.environ.get("APP_SETTINGS"))
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

from models import flask_db

@app.route("/getall")
def get_all():
    try:
        books = flask_db.query.all()
        return jsonify([e.display_question() for e in books])
    except Exception as e:
        return str(e)


@app.route('/java/questions', methods=['GET', 'POST'])
def java():
    try:
        answers = []
        questions = []
        data = flask_db.query.all()[:10]
        for question in data:
            questions.append(question.display_question())
            answers.append(question.display_answer())
        return jsonify(questions)
    except Exception as e:
        return str(e)


@app.route('/python/questions', methods=['GET', 'POST'])
def python():
    try:
        answers = []
        questions = []
        data = flask_db.query.all()[10:20]
        for question in data:
            questions.append(question.display_question())
            answers.append(question.display_answer())
        return jsonify(questions)
    except Exception as e:
        return str(e)


@app.route('/javascript/questions', methods=['GET', 'POST'])
def javascript():
    try:
        answers = []
        questions = []
        data = flask_db.query.all()[20:]
        for question in data:
            questions.append(question.display_question())
            answers.append(question.display_answer())
        return jsonify(questions)
    except Exception as e:
        return str(e)

# @app.route('/javascript/submit', methods=['POST'])
# def submit():
#     marks = {}
#     answers_list = request.get_json()["answers"]
#     marks["percentage"] = (sum(answers_list)/20)*100
#     print(marks)
#     print(request.data)
#     return marks

# @app.route('/javascript/submit', methods=['POST'])
# def submit():
