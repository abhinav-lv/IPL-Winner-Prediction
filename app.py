# Import libraries
import pandas
import pickle
from flask import Flask, request, jsonify, render_template

# Initialize app
app = Flask(__name__, static_folder="client/dist/assets", template_folder="client/dist")

# List of teams
teams = ['Royal Challengers Bangalore', 'Kolkata Knight Riders',
       'Delhi Capitals', 'Sunrisers Hyderabad', 'Mumbai Indians',
       'Kings XI Punjab', 'Gujarat Titans', 'Rajasthan Royals',
       'Chennai Super Kings', 'Lucknow Supergiants']

# List of cities
cities = ['Hyderabad', 'Bangalore', 'Mumbai', 'Kolkata', 'Delhi', 
          'Jaipur', 'Chennai', 'Ahmedabad','Dharamsala', 'Kanpur']

# Load the model
pipe = pickle.load(open('model/pipe.pkl','rb'))

# Root route - serve React client
@app.route("/")
def home():
    return render_template('index.html')

# Endpoint to get the teams and cities
@app.route("/api/getTeamsAndCities")
def getTeamsAndCities():
    return jsonify({'teams': teams, 'cities': cities})

# Endpoint to get the prediction result
@app.route("/api", methods=["GET", "POST"])
def api():
    if request.method == "POST":
        data = request.json
        runs_left = data['target'] - data['score']
        balls_left = 120 - data['overs'] * 6
        input_df = pandas.DataFrame({
            'batting_team': [data['battingTeam']],
            'bowling_team': [data['bowlingTeam']],
            'city': [data['city']],
            'runs_left': [runs_left],
            'balls_left': [balls_left],
            'wickets_left': [data['wickets']],
            'total_runs_x': [data['target']],
            'curr_rr': [data['score'] / data['overs']],
            'required_rr': [runs_left * 6 / balls_left]
        })
        result = pipe.predict_proba(input_df)
        loss = result[0][0]
        win = result[0][1]
        return jsonify({'probabilities': {
            'battingTeam': win,
            'bowlingTeam': loss
        }})
    return jsonify({'data': 'API bitch'})