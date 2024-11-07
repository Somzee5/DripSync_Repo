import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './TryOn.css';
import api from '../utils/api';

const TryOn = () => {
  const location = useLocation();
  const [userId, setUserId] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [virtualTryOnImage, setVirtualTryOnImage] = useState(null);
  
  const productImageURL = location.state?.productImage;

  useEffect(() => {
    // Retrieve the user_id from sessionStorage
    const storedUserId = sessionStorage.getItem('user_id');
    if (storedUserId) {
      setUserId(storedUserId);
      
      // Fetch user's profile image (captured_image) from the backend
      const fetchProfileImage = async () => {
        try {
          const response = await api.get(`/myprofile/${storedUserId}/`);
          const profileImageUrl = `http://127.0.0.1:8000${response.data.profile.captured_image}`;
          
          // Convert profile image URL to Blob
          const imageResponse = await fetch(profileImageUrl, { mode: 'cors' });
          const imageBlob = await imageResponse.blob();
          setCapturedImage(imageBlob);
        } catch (error) {
          console.error('Error fetching profile image:', error);
        }
      };

      fetchProfileImage();
    } else {
      console.error('User ID not found in session storage');
    }
  }, []);

  const handleSubmit = async () => {
    if (!capturedImage) {
      alert('Profile image not found. Please ensure you have a profile image.');
      return;
    }

    const formData = new FormData();
    formData.append('original_image', capturedImage, 'original_image.jpg');

    try {
      if (productImageURL) {
        // Fetch the product image from the URL
        const response = await fetch(productImageURL, { mode: 'cors' });
        const blob = await response.blob();

        // Convert product image blob to JPEG and append to formData
        const productImageBlob = await new Promise((resolve) => {
          const image = new Image();
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          image.src = URL.createObjectURL(blob);

          image.onload = () => {
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);
            canvas.toBlob(resolve, 'image/jpeg');
          };
        });

        formData.append('product_image', productImageBlob, 'product_image.jpg');

        // Send data to Flask backend for try-on processing
        const res = await fetch('http://localhost:5001/try-on', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const result = await res.json();
          setVirtualTryOnImage(`http://localhost:5001/${result.result_image}`);
        } else {
          console.error('Virtual try-on failed.');
          alert('Could not process the try-on.');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during virtual try-on.');
    }
  };

  return (
    <div className="try-on-container">
      <div className="try-on-card">
        <h3>Your Profile Image</h3>
        {capturedImage ? (
          <img src={URL.createObjectURL(capturedImage)} alt="Profile" className="try-on-image" />
        ) : (
          <p>Loading profile image...</p>
        )} 
      </div>
      <div className="try-on-card">
        <h3>Virtual Try-On Result</h3>
        {virtualTryOnImage ? (
          <img src={virtualTryOnImage} alt="Virtual Try-On" className="try-on-image" />
        ) : (
          <p>No virtual try-on result yet.</p>
        )}
      </div>
      <button onClick={handleSubmit} className="submit-button">
        Try On
      </button>
    </div>
  ); 
};

export default TryOn;
