from flask import Flask, jsonify, request
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def search_description(df, search_term):
    # Filter the DataFrame based on the search term
    filtered_df = df[df['Category'].str.contains(search_term, case=False, na=False)]
    return filtered_df

@app.route('/get-data', methods=['GET'])
def get_data():
    search_term = request.args.get('search_term', '')
    gender = request.args.get('gender', '')
    
    if not gender or not search_term:
        return jsonify({"error": "Gender or search term is missing"}), 400

    print(f"Gender: {gender}, Search Term: {search_term}")

    # Load the appropriate dataset based on gender
    if gender.lower() == 'men':
        df = pd.read_csv("Ajio_Men_Clothing_Updated.csv")
    elif gender.lower() == 'women':
        df = pd.read_csv("Ajio_Women_Clothing_Updated.csv")
    else:
        return jsonify({"error": "Invalid gender"}), 400

    # Search the description in the DataFrame
    new_df = search_description(df, search_term)
    new_df = new_df[['URL_image', 'Brand', 'Description']]

    # Convert the filtered DataFrame to a dictionary format
    data = new_df.to_dict(orient='records')

    # Return the data as a JSON response
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
