import React, { useState } from 'react';
import api from '../utils/api'; // Assuming axios is configured here
import { useParams } from 'react-router-dom';

const Profile = () => {
  const { user_id } = useParams();
  const [profileData, setProfileData] = useState({
    height: '',
    weight: '',
    age: '',
    gender: 'M',
    skin_tone: 'LT',
    captured_image: null, // For file upload, store the file here
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle image file upload
  const handleFileChange = (e) => {
    setProfileData((prevData) => ({ ...prevData, captured_image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('height', profileData.height);
    formData.append('weight', profileData.weight);
    formData.append('age', profileData.age);
    formData.append('gender', profileData.gender);
    formData.append('skin_tone', profileData.skin_tone);
    
    // Append image file if selected
    if (profileData.captured_image) {
      formData.append('captured_image', profileData.captured_image);
    }

    try {
      const response = await api.post(`/profile/${user_id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Profile created:', response.data);
    } catch (error) {
      console.error('Error creating profile:', error.response.data);
    }
  };

  return (
    <div>
      <h1>Create Profile</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Height:</label>
          <input type="number" name="height" value={profileData.height} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Weight:</label>
          <input type="number" name="weight" value={profileData.weight} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Age:</label>
          <input type="number" name="age" value={profileData.age} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Gender:</label>
          <select name="gender" value={profileData.gender} onChange={handleInputChange}>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
        </div>
        <div>
          <label>Skin Tone:</label>
          <select name="skin_tone" value={profileData.skin_tone} onChange={handleInputChange}>
            <option value="LT">Light</option>
            <option value="MD">Medium</option>
            <option value="DK">Dark</option>
          </select>
        </div>
        <div>
          <label>Upload Image:</label>
          <input type="file" name="captured_image" onChange={handleFileChange} accept="image/*" />
        </div>
        <button type="submit">Create Profile</button>
      </form>
    </div>
  );
};

export default Profile;
