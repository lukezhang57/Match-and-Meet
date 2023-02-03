

from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import pandas as pd
import mysql.connector
import sys
import requests
import pandas as pd
from bs4 import BeautifulSoup
import ast

def get_majors():
    url = "https://myillini.illinois.edu/Programs"
    data = requests.get(url)
    html = BeautifulSoup(data.text,'html.parser')
    results = html.find_all("p",class_="mb-0")
    majors = []
    for i in range(len(results)):
        str = results[i].text.replace("\n", "")
        majors.append(str)
    return majors

def get_classes():
    df = pd.read_csv("https://waf.cs.illinois.edu/discovery/gpa.csv")
    df.groupby("Course Title").agg("count").reset_index()
    classes = df["Course Title"][df["Year"]>=2021]
    courses = []
    for i in range(len(classes)):
        if classes[i] not in courses:
            courses.append(classes[i])
    return courses

app = Flask(__name__)
CORS(app, resources={"/register" : {"origins" : "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

cnx = mysql.connector.connect(user="root", password="csmongers", host="34.70.251.170", database="MatchandMeet")
cursor = cnx.cursor()

MAJORS = get_majors()
INTERESTS = ["Powerlifting", "Soccer", "Basketball", "Football","Badminton","Tennis","Table Tennis","Running","Cycling"]
RSOS = ["Association of Computing Machinery", "Asian American Association", "Illini Esports", "iRobotics", "Cricket Club of Illinois", "Engineering Council", "Illini Biliards Club", "Illini Kendo Club", "Illini Powerlifting Club", "K-Project", "Men's Club Soccer"]
CLASSES = get_classes()

@app.route("/login", methods=["POST"])  
@cross_origin()
def login():
    request_data = request.get_json()
    username, password = request_data["username"], request_data["password"]
    login_query = 'SELECT * FROM Login WHERE NetID="{}";'.format(username)  
    cursor.execute(login_query)
    frame = pd.DataFrame(cursor.fetchall())
    if (frame.empty):
        return {"successful" : False}, 401  
    frame.columns = ["NetID", "FirstName", "LastName", "Password"]
    print (frame)
    # Password matches, login successful
    if (password == frame.at[0, "Password"]):
        return  {"successful" : True}, 200
    return {"successful" : False}, 404

@app.route("/register", methods=["POST"])
@cross_origin()
def register(): 
    request_data = request.get_json()
    username, password, firstName = request_data["username"], request_data["password"], request_data["firstName"]
    lastName, residence = request_data["lastName"], request_data["residence"]
    majorID, currentClasses = request_data["majorID"], request_data["currentClasses"]
    # print (request_data["interestIDs"])
    # interestIDs = ast.literal_eval(request_data["interestIDs"])
    # rsoIDs = ast.literal_eval(request_data["rsoIDs"])
    interestIDs = request_data["interestIDs"]
    rsoIDs = request_data["rsoIDs"]

    # Can't register a new user with existing netId
    cursor.execute('SELECT * FROM Login WHERE NetID="{}";'.format(username))
    frame = pd.DataFrame(cursor.fetchall())
    if (not frame.empty):
        return {"successful" : False}, 401  
    
    insertion_query = "INSERT INTO Students (NetID,FirstName,LastName,Major,Residence) VALUES('" + str(username) + "','" + str(firstName) + "','" + str(lastName) + "','" + str(MAJORS[majorID]) +  "','" + str(residence) + "');"
    cursor.execute(insertion_query)
    cnx.commit()
    insertion_query = "INSERT INTO Major (MajorID,NetID,CurrentCourses) VALUES(" + str(majorID) + ",'" + str(username) + "','" + str(currentClasses) + "');"
    cursor.execute(insertion_query)
    cnx.commit()
    insertion_query = "INSERT INTO Login (NetID,FirstName,LastName,Password) VALUES('" + str(username) + "','" + str(firstName) + "','" + str(lastName) + "','" + str(password) + "');"
    cursor.execute(insertion_query)
    cnx.commit()

    for interestIx in interestIDs:
        insertion_query = "INSERT INTO Interests (InterestID, NetID, Interests) VALUES (" + str(interestIx )+ ",'" + str(username) + "','" + str(INTERESTS[interestIx]) + "');"
        cursor.execute(insertion_query)
        cnx.commit()
    
    for rsoIx in rsoIDs:
        insertion_query = "INSERT INTO RSOMembers (RsoID, NetID, FirstName, LastName) VALUES (" + str(rsoIx)+ ",'" + str(username) + "','" + firstName + "','" + lastName + "');"
        cursor.execute(insertion_query)
        cnx.commit()
    return {"successful" : True}, 200


@app.route("/Home/EditProfile<Net_Id>", methods=["GET"])
@cross_origin()
def update(Net_Id):
    print("hey")
     # GET request
    print(Net_Id)
    login_query = 'SELECT * FROM Login NATURAL JOIN Students NATURAL JOIN Major WHERE NetID="{}";'.format(Net_Id)  
    cursor.execute(login_query)
    frame = pd.DataFrame(cursor.fetchall())
    listOfLogin = []
    listOfLogin = frame.values.tolist()
    login_query = 'SELECT * FROM Interests WHERE NetID="{}";'.format(Net_Id)  
    cursor.execute(login_query)
    frame = pd.DataFrame(cursor.fetchall())
    listOfInterest = [[]]
    listOfInterest[0] = frame.values.tolist()
    login_query = 'SELECT * FROM RSOMembers WHERE NetID="{}";'.format(Net_Id)  
    cursor.execute(login_query)
    frame = pd.DataFrame(cursor.fetchall())
    listOfRSOMembers = [[]]
    listOfRSOMembers[0]= frame.values.tolist()
    
    
    listOfDFRows = listOfLogin + listOfInterest + listOfRSOMembers
    print(listOfDFRows)
    return jsonify(listOfDFRows)  # serialize and use JSON headers

@app.route("/mutual/<num_friends>/<net_id>", methods=["GET"])
@cross_origin()
def getMutals(num_friends, net_id):
     # GET request
    print ("Num Friends", num_friends)
    print ("NetID: ", net_id)
    stored_procedure = 'CALL MatchMeet ({}, "{}");'.format(num_friends, net_id)  
    cursor.execute(stored_procedure)
    frame = pd.DataFrame(cursor.fetchall())
    listOfMutualFriends= frame.values.tolist()
    print (listOfMutualFriends)
    return jsonify(listOfMutualFriends)  # serialize and use JSON headers

@app.route("/Home/EditProfile", methods=["POST"])
@cross_origin()
def update_post():
    request_data = request.get_json()
    
    username, password, firstName = request_data["username"], request_data["password"], request_data["firstName"]
    lastName, residence = request_data["lastName"], request_data["residence"]
    majorID, currentClasses = request_data["majorID"], request_data["currentClasses"]
    interestIDs = request_data["interestIDs"]
    rsoIDs = request_data["rsoIDs"]
    print("heyyy")

    
    update_query = "UPDATE Students SET FirstName= '" + str(firstName) + "'," + "LastName= '" + str(lastName) + "'," + "Major= '" + str(MAJORS[majorID]) + "'," + "Residence = '" + str(residence) + "' WHERE NetID =  '" + str(username) +  "';"
    
    print(update_query)
    cursor.execute(update_query)
    cnx.commit()
    
    update_query = "UPDATE Major SET MajorID= '" + str(majorID) + "'," + "CurrentCourses= '" + str(currentClasses) + "' WHERE NetID =  '" + str(username) + "';"
    print(update_query)
    cursor.execute(update_query)
    cnx.commit()
    update_query = "UPDATE Login SET FirstName= '" + str(firstName) + "'," + "LastName= '" + str(lastName) + "'," + "Password= '" + str(password) + "' WHERE NetID =  '" + str(username) + "';"
    print(update_query)
    # insertion_query = "INSERT INTO Login (NetID,FirstName,LastName,Password) VALUES('" + str(username) + "','" + str(firstName) + "','" + str(lastName) + "','" + str(password) + "');"
    cursor.execute(update_query)
    cnx.commit()
    
    # UPDATE Customers
    # SET ContactName = 'Alfred Schmidt', City= 'Frankfurt'
    # WHERE CustomerID = 1;
    print("0")
    delete = "DELETE FROM Interests WHERE NetID = '" + str(username) + "';"
    cursor.execute(delete)
    cnx.commit()
    print("1")
    for interestIx in interestIDs:
        insertion_query = "INSERT INTO Interests (InterestID, NetID, Interests) VALUES (" + str(interestIx)+ ",'" + str(username) + "','" + str(INTERESTS[interestIx]) + "');"
        #update_query = "UPDATE Interests SET InterestID= " + str(interestIx) + "," + "Interests= '" + str(INTERESTS[interestIx]) + "' WHERE NetID =  '" + str(username) + "';"
        print(insertion_query)
        cursor.execute(insertion_query)
        cnx.commit()
    delete = "DELETE FROM RSOMembers WHERE NetID = '" + str(username) + "';"
    cursor.execute(delete)
    cnx.commit()
    print("2")
    for rsoIx in rsoIDs:
        insertion_query = "INSERT INTO RSOMembers (RsoID, NetID, FirstName, LastName) VALUES (" + str(rsoIx)+ ",'" + str(username) + "','" + firstName + "','" + lastName + "');"
        #update_query = "UPDATE RSOMembers SET RsoID= '" + str(rsoIx) + "'," + "FirstName= '" + str(firstName) + "'," + "LastName= '" + str(lastName) + "' WHERE NetID =  '" + str(username) + "';"
        #print(update_query)
        cursor.execute(insertion_query)
        cnx.commit()
        
    return {"successful" : True}, 200




@app.route("/Home/Delete<Net_Id>", methods=["POST"])
@cross_origin()
def delete(Net_Id):
    delete = "DELETE FROM Login WHERE NetID = '" + str(Net_Id) + "';"
    cursor.execute(delete)
    cnx.commit()
    delete = "DELETE FROM Students WHERE NetID = '" + str(Net_Id) + "';"
    cursor.execute(delete)  
    cnx.commit()
    delete = "DELETE FROM Major WHERE NetID = '" + str(Net_Id) + "';"
    cursor.execute(delete)
    cnx.commit()
    delete = "DELETE FROM Interests WHERE NetID = '" + str(Net_Id) + "';"
    cursor.execute(delete)
    cnx.commit()
    delete = "DELETE FROM RSOMembers WHERE NetID = '" + str(Net_Id) + "';"
    cursor.execute(delete)
    cnx.commit()
    return {"successful" : True}, 200


@app.route("/Home/Search<Course>", methods=["GET"])  
@cross_origin()
def search(Course):
    print(type(Course))
    print(Course)
    login_query = 'SELECT NetID, FirstName, LastName FROM Students NATURAL JOIN Major WHERE CurrentCourses LIKE \'%{}%\';'.format(Course)
    print(login_query)
    cursor.execute(login_query)
    frame = pd.DataFrame(cursor.fetchall())
    values = frame.values.tolist()
    print(values)
    return jsonify(values)


@app.route("/Home/PopularInterests", methods=["GET"])  
@cross_origin()
def popularInterests():
    popular_interests = "SELECT DISTINCT i.Interests FROM Students s NATURAL JOIN Interests i WHERE i.InterestID IN (SELECT i2.InterestID FROM Interests i2 GROUP BY InterestID HAVING COUNT(InterestID) > 4000);"
    cursor.execute(popular_interests)
    frame = pd.DataFrame(cursor.fetchall())
    values = frame.values.tolist()
    print(values)
    return jsonify(values)

@app.route("/Home/FindFriends", methods=["GET"])  
@cross_origin()
def findFriends():
    popular_interests = "SELECT s.NetID, s.FirstName, s.LastName FROM Students s WHERE s.Major LIKE \"%Computer Science%\" AND s.Residence IN (SELECT Residence FROM Students s1 GROUP BY Residence HAVING COUNT(Residence) > 500);"
    cursor.execute(popular_interests)
    frame = pd.DataFrame(cursor.fetchall())
    values = frame.values.tolist()
    print(values)
    return jsonify(values)

@app.route("/requests/<username>", methods=["GET"])
@cross_origin()
def getFriendRequests(username):
    # Get the current requests
    get_requests = 'SELECT Requests FROM Students WHERE NetID="{}";'.format(username)  
    cursor.execute(get_requests)
    frame = pd.DataFrame(cursor.fetchall())
    print("Requests:", frame)
    if (not frame.empty):
        frame.columns = ["Requests"]       
    values = frame.values.tolist()

    if request.method == "GET":
        return jsonify(values)

@app.route("/requests", methods=["POST", "DELETE"])  
@cross_origin()
def updateFriendRequests():
    # Get the current requests
    request_data = request.get_json()
    username = request_data["username"]
    get_requests = 'SELECT Requests FROM Students WHERE NetID="{}";'.format(username)  
    cursor.execute(get_requests)
    frame = pd.DataFrame(cursor.fetchall())
    print("Requests:", frame)
    if (not frame.empty):
        frame.columns = ["Requests"]       

    if request.method == "POST":
        new_request = request_data["new_request"]
        current_requests = "" if frame.empty else frame.at[0, "Requests"]
        # Only add request if it doesn't already exist
        if (len(current_requests) == 0):
            update_query = "UPDATE Students SET Requests= '" + str(new_request + ",") + "' WHERE NetID =  '" + str(username) + "';"
            cursor.execute(update_query)
            cnx.commit()
            return {"successful" : True}, 200
        if (current_requests.find(new_request + ",") == -1):
            current_requests += new_request + ","
            update_query = "UPDATE Students SET Requests= '" + str(current_requests) + "' WHERE NetID =  '" + str(username) + "';"
            cursor.execute(update_query)
            cnx.commit()
            return {"successful" : True}, 200
        else:
            return {"successful" : True}, 200
    elif request.method == "DELETE":
        new_request = request_data["new_request"]
        current_requests = "" if frame.empty else frame.at[0, "Requests"]
        print (new_request)
        current_requests = current_requests.replace(new_request + ",", "")
        update_query = "UPDATE Students SET Requests= '" + str(current_requests) + "' WHERE NetID =  '" + str(username) + "';"
        cursor.execute(update_query)
        cnx.commit()
        return {"successful" : True}, 200

@app.route("/friends/<username>", methods=["GET"])  
@cross_origin()
def getFriends(username):
    print(username)
    # Get the current friends
    get_friends = 'SELECT Friends FROM Students WHERE NetID="{}";'.format(username)  
    print(get_friends)
    cursor.execute(get_friends)
    frame = pd.DataFrame(cursor.fetchall())
    if (not frame.empty):
        frame.columns = ["Friends"]  
    values = frame.values.tolist()

    # Getting all current friends
    if request.method == "GET":
        return jsonify(values)

@app.route("/friends", methods=["POST"])  
@cross_origin()
def updateFriends():
    # Get the current friends
    request_data = request.get_json()
    username = request_data["username"]
    get_friends = 'SELECT Friends FROM Students WHERE NetID="{}";'.format(username)  
    cursor.execute(get_friends)
    frame = pd.DataFrame(cursor.fetchall())
    if (not frame.empty):
        frame.columns = ["Friends"]

    # Adding new friend
    if request.method == "POST":
        new_friend = request_data["new_friend"]
        current_friends = "" if frame.empty else frame.at[0, "Friends"]
        # Add friend if not already friends
        if (current_friends is None or len(current_friends) == 0):
            update_query = "UPDATE Students SET Friends= '" + str(new_friend + ",") + "' WHERE NetID =  '" + str(username) + "';"
            cursor.execute(update_query)
            cnx.commit()
            return {"successful" : True}, 200
        elif (current_friends.find(new_friend + ",") == -1):
            current_friends += new_friend + ","
            print(current_friends)
            update_query = "UPDATE Students SET Friends= '" + str(current_friends) + "' WHERE NetID =  '" + str(username) + "';"
            cursor.execute(update_query)
            cnx.commit()
            return {"successful" : True}, 200
        else:
            return {"successful" : True}, 200


if __name__ == "__main__": 
    app.run()