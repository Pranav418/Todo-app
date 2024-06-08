from flask import Flask, request, url_for
from flask_pymongo import PyMongo
from bson.json_util import dumps
from bson.json_util import loads
from bson import json_util
import json
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv('MONGO_URI')

app = Flask(__name__)
app.config['MONGO_URI'] = MONGO_URI

mongo = PyMongo(app)
# db = mongo.db

print(mongo)
print(type(mongo))
print(type(mongo.db))
app = Flask(__name__)

def parse_json(data):
    return json.loads(json_util.dumps(data))


@app.route("/")
def home():

    return """
    <form method="POST" action="/create" enctype="multipart/form-data">
        <input type="text> name="username">
        <input type="file" name="profile_image">
        <input type="submit"> 
    """

@app.route("/create", methods=["POST"])
def create():
    if 'profile_image' in request.files:
        profile_image = request.files['profile_image']
        mongo.save_file(profile_image.filename, profile_image)
        mongo.db.users.insert({'username' : request.form.get('username'), 'profile_image' : profile_image.filename})

    return 'done'
@app.route("/members")
def members():
    # return {
    #     'Name':"geek", 
    #     "Age":"22",
    #     "Date":"1", 
    #     "programming":"python"
    #     }
    return {"members": 
    ["Wash Dishes", "Code", "Paint"]
    }

    #return {id: '32f269fe-c0aa-4bba-bcd7-09d640eaa026', title: 'aa', completed: false}
    
@app.route("/data", methods=['GET','POST'])
def database():
    if request.method == "POST":
        # task = request.form.get('nm')
        task = request.get_json()
        print(task)
        mongo.db.users.insert_one(task)
        return {'Result': 'Done!'}
    else:
        user = mongo.db.users.find({ "title": { '$ne': None } })  
        tasks = loads(dumps(user))
        return parse_json(tasks)

@app.route("/delete", methods=['POST'])
def delete():
    if request.method == "POST":
        task = request.get_json()
        print(task)
        mongo.db.users.delete_one({"id": task['ID']})
        return "", 204

@app.route("/toggle", methods=['POST'])
def toggle():
    if request.method == "POST":
        task = request.get_json()
        print("XYZ")
        print(task)
        mongo.db.users.update_one({"id": task['ID']}, {"$set": {"completed": task['completed']}})
        return "", 200 



if __name__ == "__main__":
    app.run(debug=True)