from app import db

class flask_db(db.Model):
    __tablename__ = 'qna'

    qno = db.Column(db.Integer, primary_key=True)
    qas = db.Column(db.String())
    op1 = db.Column(db.String())
    op2 = db.Column(db.String())
    op3 = db.Column(db.String())
    op4 = db.Column(db.String())
    ans = db.Column(db.Integer)

    def __init__(self, qno, qas, op1, op2, op3, op4, ans):
        self.qas = qas
        self.qno = qno
        self.op1 = op1
        self.op2 = op2
        self.op3 = op3
        self.op4 = op4
        self.ans = ans
    #
    # def __repr__(self):
    #     return '<qno {}>'.format(self.qno)
    
    def display_question(self):
        return {
            'qno': self.qno,
            'qas': self.qas,
            'op1': self.op1,
            'op2': self.op2,
            'op3': self.op3,
            'op4': self.op4,
        }

    def display_answer(self):
        return self.ans
