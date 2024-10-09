from flask import Flask, jsonify, request
import pandas as pd
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
def search_description(df, search_term):
    # Filter the DataFrame based on the search term in the description
    filtered_df = df[df['Description'].str.contains(search_term, case=False, na=False)]
    return filtered_df

@app.route('/get-data', methods=['GET'])
def get_data():
    # Read the CSV file into a DataFrame
    df = pd.read_csv("Ajio_Women_Clothing_Updated.csv")
    # Get the search term from the request's query parameters
    search_term = request.args.get('search_term', '')

    # Search the description in the DataFrame
    new_df = search_description(df, search_term)
    new_df = new_df[['URL_image', 'Brand', 'Description']]
    print(new_df.head(3))


    # Convert the filtered DataFrame to a dictionary format
    data = new_df.to_dict(orient='records')

    # Return the data as a JSON response
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True, port=5000)