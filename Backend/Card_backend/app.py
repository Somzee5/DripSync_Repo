from flask import Flask, jsonify, request
import pandas as pd
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

male_categories = [
    'Graphic T-Shirts', 'Henley T-Shirts', 'Polo T-Shirts', 'Casual Shirts', 
    'Formal Shirts', 'Round Neck T-Shirts', 'V-Neck T-Shirts', 'Long Sleeve T-Shirts', 
    'Oversized T-Shirts', 'Sweatshirts', 'Hoodies', 'Cardigans', 'Blazers', 
    'Jackets', 'Denim Jackets', 'Leather Jackets', 'Bomber Jackets', 'Biker Jackets', 
    'Puffer Jackets', 'Coats', 'Trench Coats', 'Parkas', 'Overcoats', 'Vests', 
    'Puffer Vests', 'Waistcoats', 'Cargo Pants', 'Chinos', 'Joggers', 'Track Pants', 
    'Trousers', 'Denim Shorts', 'Cargo Shorts', 'Bermuda Shorts', 'Athletic Shorts', 
    'Casual Shorts', 'Lounge Shorts'
]

female_categories = [
    'Mini', 'Bodycon', 'Wrap', 'Shift', 'A-line', 'Skater', 'Slip', 'Halter', 
    'Off-Shoulder', 'Peplum', 'Sheath', 'Midi', 'Maxi', 'Halter', 'Off-Shoulder T-Shirts', 
    'Skirts', 'Blazer Sets', 'Blouses', 'Lehengas', 'Anarkali', 'Sarees', 'Salwar Suits',
    'Sharara Sets', 'Ethnic Jackets', 'Sports Bras', 'Leggings', 'Yoga Pants',
    'Palazzos', 'Culottes', 'Skorts', 'High-Waisted Skirts', 'Peplum Skirts',
    'Pant Suits', 'Skirt Suits', 'Co-ord Sets'
]

unisex_categories = [
    'Shirts', 'T-Shirts', 'Tank Tops', 'Pullover Sweaters', 'Oversized Shirts',
    'Button-Down Shirts', 'Sweatshirts', 'Hoodies', 'Blazers', 'Denim Jackets', 
    'Casual Jackets', 'Raincoats', 'Printed Leggings', 'Cropped Trousers', 
    'Graphic T-Shirts', 'Wrap Tops', 'Sweaters'
]

# Load similarity matrices for recommendations
similarity1 = np.load(r'D:\DripSync-MP\DripSync_Repo\Model Training\similarity_matrix_men.npy')
similarity2 = np.load(r'D:\DripSync-MP\DripSync_Repo\Model Training\similarity_matrix_women.npy')

# Load skin tone and body type dataframes
skin_tone_df = pd.read_csv(r"D:\DripSync-MP\DripSync_Repo\Backend\Card_backend\Impl2.csv")
body_type_df = pd.read_csv(r"D:\DripSync-MP\DripSync_Repo\Backend\Card_backend\Body_Type.csv")

def search_description(df, search_term):
    # Filter the DataFrame based on the search term
    filtered_df = df[df['Category'].str.contains(search_term, case=False, na=False)]
    if filtered_df.empty:
        return search_bar(df, search_term)
    
    return filtered_df

def search_bar(df, search_term):
    filtered_df = df[df['Description'].str.contains(search_term, case=False, na=False)]
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
    elif gender == 'women':
        df = pd.read_csv("Ajio_Women_Clothing_Updated.csv")

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

    if outfit_indices.empty:
        return []

    outfit_index = outfit_indices[0]
    distances = similarity[outfit_index]

    outfits_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[1:7]  # Top 6 related products

    recommended_outfits = [df.iloc[i[0]].Id_Product for i in outfits_list]
    return recommended_outfits

@app.route('/get-related-products', methods=['GET'])
def get_related_products():
    product_id = request.args.get('product_id', '')
    gender = request.args.get('gender', '')

    if gender == 'men':
        df = pd.read_csv("Ajio_Men_Clothing_Updated.csv")
    elif gender == 'women':
        df = pd.read_csv("Ajio_Women_Clothing_Updated.csv")

    related_product_ids = recommend(df, product_id, gender)

    if related_product_ids:
        related_products = df[df['Id_Product'].isin(related_product_ids)][['URL_image', 'Brand', 'Description', 'Id_Product', 'Category']].to_dict(orient='records')
        return jsonify(related_products)
    else:
        return jsonify({"error": "No related products found"}), 404

@app.route('/get-personalized-categories', methods=['GET'])
def get_personalized_categories():
    skintone = request.args.get('skintone', '')
    gender = request.args.get('gender', '')
    height = request.args.get('height', '')
    weight = request.args.get('weight', '')
    waist = request.args.get('waist', '')

    try:
        height = float(height)
        weight = float(weight)
        waist = float(waist)
    except ValueError:
        return jsonify({"error": "Height, weight, and waist must be numbers"}), 400

    body_type = calculate_body_type(height, weight, waist)

    if not skintone or not gender or not body_type:
        return jsonify({"error": "Skin tone, gender, and body type are required"}), 400

    personalized_categories = personalised(body_type, gender, body_type_df)
    result = personalized_categories if personalized_categories else []

    return jsonify(result)

def personalised(body_type, gender, body_type_df):
    suitable_categories = set()
    if body_type in body_type_df.columns:
        suitable_categories.update(body_type_df[body_type_df[body_type].notna()][body_type].tolist())
    if 'All Body Types' in body_type_df.columns:
        suitable_categories.update(body_type_df[body_type_df['All Body Types'].notna()]['All Body Types'].tolist())

    if gender.lower() == 'men':
        filtered_categories = suitable_categories.intersection(set(male_categories + unisex_categories))
    elif gender.lower() == 'women':
        filtered_categories = suitable_categories.intersection(set(female_categories + unisex_categories))
    else:
        filtered_categories = suitable_categories

    return list(filtered_categories)

def calculate_body_type(height, weight, waist):
    height_m = height / 100
    bmi = weight / (height_m ** 2)
    whtr = waist / height

    if 18.5 <= bmi <= 24.9:
        if whtr < 0.5:
            return "Hourglass"
        elif 0.5 <= whtr < 0.6:
            return "Rectangle"
        elif whtr >= 0.6:
            return "Apple"
    elif bmi > 24.9:
        if whtr < 0.5:
            return "Pear"
        elif 0.5 <= whtr < 0.6:
            return "Inverted Triangle"
        elif whtr >= 0.6:
            return "Apple"
    elif bmi < 18.5:
        if whtr < 0.5:
            return "Slender"
    return None

if __name__ == '__main__':
    app.run(debug=True)
