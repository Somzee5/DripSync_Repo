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
    new_df = new_df[['URL_image', 'Brand', 'Description', 'Id_Product']]

    # Convert the filtered DataFrame to a dictionary format
    data = new_df.to_dict(orient='records')

    # Return the data as a JSON response
    return jsonify(data)




@app.route('/get-product-details', methods=['GET'])
def get_product_details():
    product_id = request.args.get('product_id', '')
    gender = request.args.get('gender', '')

    if gender == 'men':
        df = pd.read_csv("Ajio_Men_Clothing_Updated.csv")
    else:
        df = pd.read_csv("Ajio_Women_Clothing_Updated.csv")

    # Try to convert the product_id to a number (int or float) to match the data type in the DataFrame
    try:
        product_id = int(product_id)  # Convert to int if Id_Product is stored as an integer
    except ValueError:
        return jsonify({"error": "Invalid product ID format"}), 400

    product = df[df['Id_Product'] == product_id].to_dict(orient='records')

    if product:
        return jsonify(product[0])  # Return the first matching product
    else:
        return jsonify({"error": "Product not found"}), 404






if __name__ == '__main__':
    app.run(debug=True, port=5000)
