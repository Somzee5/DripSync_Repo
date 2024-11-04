import React, { useState } from 'react'; 
import { useLocation } from 'react-router-dom';
import './TryOn.css';

const TryOn = () => {
  const location = useLocation();
  const [originalImage, setOriginalImage] = useState(null);
  const [virtualTryOnImage, setVirtualTryOnImage] = useState(null);

  const productImageURL = location.state?.productImage;
  console.log("Product Image URL:", productImageURL);

  const handleImageUpload = (event) => {
    setOriginalImage(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!originalImage) {
      alert('Please upload an image first!');
      return;
    }

    const formData = new FormData();
    formData.append('original_image', originalImage);

    try {
      if (productImageURL) {
        // Fetch the product image from the URL
        const response = await fetch(productImageURL, { mode: 'cors' });
        if (!response.ok) {
          console.error('Failed to fetch product image from URL');
          alert('Could not fetch product image.');
          return;
        }
        
        // Convert the response to a blob and create a new image from it
        const blob = await response.blob();
        const image = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        image.src = URL.createObjectURL(blob);
        
        image.onload = async () => {
          // Set the canvas dimensions to the image dimensions
          canvas.width = image.width;
          canvas.height = image.height;
          ctx.drawImage(image, 0, 0);

          // Convert the canvas to a JPEG blob
          canvas.toBlob(async (jpegBlob) => {
            formData.append('product_image', jpegBlob, 'product_image.jpg');

            // Send the request to the backend
            const res = await fetch('http://localhost:5001/try-on', {
              method: 'POST',
              body: formData,
            });

            if (res.ok) {
              const result = await res.json();
              setVirtualTryOnImage(`http://localhost:5001/${result.result_image}`);
            } else {
              console.error('Failed to fetch the virtual try-on result.');
              alert('Virtual try-on failed. Please check the backend logs for more details.');
            }
          }, 'image/jpeg');
        };
      } else {
        console.error('Product image URL is missing.');
        alert('Product image URL is required.');
        return;
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while processing the request.');
    }
  };

  return (
    <div className="try-on-container">
      <div className="try-on-card">
        <h3>Original Image</h3>
        <label htmlFor="file-upload" className="file-upload-label">
          Choose Image
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
        {originalImage && (
          <img
            src={URL.createObjectURL(originalImage)}
            alt="Original"
            className="try-on-image"
          />
        )}
      </div>
      <div className="try-on-card">
        <h3>Virtual Try-On Result</h3>
        {virtualTryOnImage ? (
          <img
            src={virtualTryOnImage}
            alt="Virtual Try-On"
            className="try-on-image"
          />
        ) : (
          <p>No virtual try-on result yet.</p>
        )}
      </div>
      <button onClick={handleSubmit} className="submit-button">
        Submit
      </button>
    </div>
  );
};

export default TryOn;
