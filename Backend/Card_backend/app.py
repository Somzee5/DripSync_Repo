from flask import Flask, jsonify, request
import pandas as pd
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

male_categories = [
     'Polo T-Shirts',  
    'Formal Shirts', 'V-Neck T-Shirts', 'Pullovers', 
    'Oversized T-Shirts', 'Sweatshirts', 'Hoodies', 'Blazers'
    , 'Denim Jackets', 'Leather Jackets',
     'Coats', 
     'Cargo Pants', 'Chinos', 'Joggers', 'Track Pants', 'Shorts', 
    'Trousers', 'Denim Shorts', 'Cargo Shorts', 'Bermuda Shorts', 'Lounge Shorts'
]

female_categories = [
    'Mini', 'Bodycon', 'Wrap', 'Shift', 'A-line', 'Skater', 'Slip', 'Halter', 
    'Off-Shoulder', 'Peplum', 'Sheath', 'Midi', 'Maxi', 'Halter', 
    'Skirts', 'Blazer', 'Blouses', 'Anarkali', 'Sarees', 'Salwar',
    'Sharara ', 'Leggings',
    'Palazzos', 'Culottes', 
    'Pant', 'Skirt', 'Co-ord'
] 

unisex_categories = [
    # 'Shirts', 'T-Shirts',
    #  'Sweatshirts', 'Hoodies', 'Blazers', 'Denim Jackets', 
    # 'Jackets', 'Cropped Trousers' 
    # , 'Sweaters'
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


@app.route('/get-display-recommended-outfits', methods=['GET'])
def display_recommended_categories():
    skin_tone = request.args.get('skintone', '')
    gender = request.args.get('gender', '')
    search_term = request.args.get('search_term', '')  # Assuming taskId is the search term here

    # Load the appropriate dataset based on gender
    if gender == 'men':
        df = pd.read_csv("Ajio_Men_Clothing_Updated.csv")
        gender_label='male'
        
    elif gender == 'women':
        df = pd.read_csv("Ajio_Women_Clothing_Updated.csv")
        gender_label='female'

    print(search_term)
    print(gender_label)

    filtered_df=main_recommended_categories(df,gender_label,search_term,skin_tone,skin_tone_df)
    
  
    filtered_data = filtered_df[['URL_image', 'Brand', 'Description', 'Id_Product']].to_dict(orient='records')

    # # Return the data as a JSON response
    return jsonify(filtered_data)





def main_recommended_categories(df, gender, search_term, skin_tone, skin_tone_df):
    # Step 1: Select relevant columns for color matching from the skin_tone_df
    color_columns = ['OUTFITS_processed', 'SUMMER OUTFIT_processed', 
                     'WINTER OUTFIT_processed', 'SPRING OUTFIT_processed']
    
    # Step 2: Filter skin_tone_df for the specified skin tone
    filtered_skin_tone_df = skin_tone_df[(skin_tone_df['SKIN TONE'] == skin_tone) & (skin_tone_df['GENDER'] == gender)]

    
    relevant_colors = set()
    for column in color_columns:
        # Extract colors that are not null and convert them to lists
        colors_for_skin_tone = filtered_skin_tone_df[filtered_skin_tone_df[column].notna()][column].tolist()
        
        # Flatten the list of colors and update the set
        for color_list in colors_for_skin_tone:
            # Convert string representation of list to actual list
            if isinstance(color_list, str):
                color_list = eval(color_list)  # Be cautious with eval; ensure input is controlled
                relevant_colors.update(color_list)

    # Convert relevant_colors set to a list
    relevant_colors_list = list(relevant_colors)

    # Debugging: Print relevant colors
    #print("Relevant colors:", relevant_colors_list)

    # Step 4: Filter the DataFrame based on the search term
    filtered_df = df[df['Description'].str.contains(search_term, case=False, na=False)]
    
    # Debugging: Print unique colors in filtered DataFrame
    #print("Unique colors in filtered DataFrame:", filtered_df['Color'].unique())

    # Trim whitespace from Color column in filtered_df
    filtered_df['Color'] = filtered_df['Color'].str.strip()

    # Debugging: Print trimmed colors
    #print("Trimmed colors in filtered DataFrame:", filtered_df['Color'].unique())

    # Step 5: Filter the DataFrame using the list of relevant colors
    filtered_df = filtered_df[filtered_df['Color'].isin(relevant_colors_list)]
    
    # Debugging: Print the final filtered DataFrame
    print("Filtered DataFrame based on relevant colors:\n", filtered_df)

    return filtered_df



if __name__ == '__main__':
    app.run(debug=True)
