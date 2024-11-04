from flask import Flask, request, jsonify, send_from_directory
import cv2
import numpy as np
import torch
import albumentations as albu
from iglovikov_helper_functions.utils.image_utils import load_rgb, pad, unpad
from iglovikov_helper_functions.dl.pytorch.utils import tensor_from_rgb_image
from cloths_segmentation.pre_trained_models import create_model
from datetime import datetime
from PIL import Image, UnidentifiedImageError
import io
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Ensure the result directory exists
RESULTS_DIR = "results"
os.makedirs(RESULTS_DIR, exist_ok=True)

# Initialize the segmentation model once
MODEL_PATH = "unet_model.pth"
model = create_model("Unet_2020-10-30")
if os.path.exists(MODEL_PATH):
    model.load_state_dict(torch.load(MODEL_PATH))
else:
    torch.save(model.state_dict(), MODEL_PATH)
model.eval()

# Define your transformation pipeline
transform = albu.Compose([albu.Normalize(p=1)], p=1)

# Function to handle image uploads with AVIF support
def load_image(file):
    try:
        print(f"File name: {file.filename}")
        print(f"File content type: {file.content_type}")
        img = Image.open(io.BytesIO(file.read())).convert("RGB")
        print(f"Loaded image size: {img.size}")
        return cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
    except (UnidentifiedImageError, ValueError) as e:
        print(f"Error loading image: {e}")
        return None

# Apply virtual try-on logic
def apply_try_on(original_image, product_image):
    # Step 1: Prepare mask for original image
    padded_image, pads = pad(original_image, factor=32, border=cv2.BORDER_CONSTANT)
    x = transform(image=padded_image)["image"]
    x = torch.unsqueeze(tensor_from_rgb_image(x), 0)

    with torch.no_grad():
        prediction = model(x)[0][0]

    mask = (prediction > 0).cpu().numpy().astype(np.uint8)
    mask = unpad(mask, pads)

    # Convert mask to a 3-channel image
    masked_img = cv2.cvtColor(mask, cv2.COLOR_GRAY2RGB) * 255
    new_img = cv2.bitwise_and(original_image, masked_img)

    # Step 2: Prepare mask for product image
    clo_image = product_image
    clo_padded_image, cpads = pad(clo_image, factor=32, border=cv2.BORDER_CONSTANT)
    y = transform(image=clo_padded_image)["image"]
    y = torch.unsqueeze(tensor_from_rgb_image(y), 0)

    with torch.no_grad():
        prediction = model(y)[0][0]

    clo_mask = (prediction > 0).cpu().numpy().astype(np.uint8)
    clo_mask = unpad(clo_mask, cpads)
    
    clo_masked_img = cv2.cvtColor(clo_mask, cv2.COLOR_GRAY2RGB) * 255
    clo_masked_img = cv2.resize(clo_masked_img, (clo_image.shape[1], clo_image.shape[0]))

    clo_new_img = cv2.bitwise_and(clo_image, clo_masked_img)
    main_img = cv2.bitwise_and(clo_image, clo_new_img)

    mask_white = masked_img
    mask_black = cv2.bitwise_not(mask_white)

    dst = cv2.bitwise_and(mask_black, original_image)
    dst3 = cv2.bitwise_or(mask_white, dst)

    design = cv2.resize(main_img, (mask_black.shape[1], mask_black.shape[0]))
    design_mask_mixed = cv2.bitwise_or(mask_black, design)

    final_mask_black_3CH = cv2.bitwise_and(design_mask_mixed, dst3)

    return final_mask_black_3CH

@app.route('/try-on', methods=['POST'])
def try_on():
    if 'product_image' not in request.files or 'original_image' not in request.files:
        return jsonify({'error': 'Product and original images must be provided'}), 400

    product_image_file = request.files['product_image']
    original_image_file = request.files['original_image']
    
    product_image = load_image(product_image_file)
    original_image = load_image(original_image_file)

    if product_image is None or original_image is None:
        return jsonify({'error': 'Could not load one or both images'}), 400

    final_result = apply_try_on(original_image, product_image)

    result_image_path = os.path.join(RESULTS_DIR, f'result_image_{datetime.now().strftime("%Y%m%d_%H%M%S")}.jpg')
    cv2.imwrite(result_image_path, final_result)

    return jsonify({'message': 'Try-on successful', 'result_image': result_image_path})

@app.route('/results/<filename>')
def get_result_image(filename):
    return send_from_directory(RESULTS_DIR, filename)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
