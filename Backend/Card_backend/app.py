from flask import Flask, jsonify, request
import pandas as pd
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

similarity1 = np.load(r'D:\DripSync-MP\DripSync_Repo\Model Training\similarity_matrix_men.npy')
similarity2 = np.load(r'D:\DripSync-MP\DripSync_Repo\Model Training\similarity_matrix_women.npy')


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
    elif gender=='women':
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


def recommend(df, outfit, gender):
    if gender == 'men':
        similarity = similarity1
    elif gender == 'women':
        similarity = similarity2
   
    outfit_indices = df[df['Id_Product'] == int(outfit)].index

    # If outfit is not found, return an empty list
    if outfit_indices.empty:
        return []

    outfit_index = outfit_indices[0]
    distances = similarity[outfit_index]

    # Get a list of tuples (index, distance), sorted by distance in descending order
    outfits_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[1:7]  # Get top 6 related products

    recommended_outfits = [df.iloc[i[0]].Id_Product for i in outfits_list]
    return recommended_outfits


@app.route('/get-related-products', methods=['GET'])
def get_related_products():
    product_id = request.args.get('product_id', '')
    gender = request.args.get('gender', '')

    if gender == 'men':
        df = pd.read_csv("Ajio_Men_Clothing_Updated.csv")
    elif gender=='women':
        df = pd.read_csv("Ajio_Women_Clothing_Updated.csv")

    related_product_ids = recommend(df, product_id, gender)

    if related_product_ids:
        related_products = df[df['Id_Product'].isin(related_product_ids)][['URL_image', 'Brand', 'Description', 'Id_Product','Category']].to_dict(orient='records')
        return jsonify(related_products)
    else:
        return jsonify({"error": "No related products found"}), 404





if __name__ == '__main__':
    app.run(debug=True, port=5000)
