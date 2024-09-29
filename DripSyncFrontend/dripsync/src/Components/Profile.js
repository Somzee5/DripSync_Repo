import React, { useState } from 'react';
import api from '../utils/api'; // Assuming axios is configured here
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBBtn,
} from 'mdb-react-ui-kit';

const Profile = () => {
  const history = useHistory();

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

      history.push('/home')
    } catch (error) {
      console.error('Error creating profile:', error.response.data);
    }
  };

  return (
    <MDBContainer fluid className='p-4 background-radial-gradient overflow-hidden'>
      <MDBRow>
        <MDBCol md='6' className='offset-md-3 position-relative'>
          <MDBCard className='my-5 bg-glass'>
            <MDBCardBody className='p-5'>
              <h1 className='text-center mb-4'>Create Profile</h1>
              <form onSubmit={handleSubmit}>
                <MDBInput
                  wrapperClass='mb-4'
                  label='Height (in cm)'
                  id='height'
                  type='number'
                  name='height'
                  value={profileData.height}
                  onChange={handleInputChange}
                  required
                />
                <MDBInput
                  wrapperClass='mb-4'
                  label='Weight (in kg)'
                  id='weight'
                  type='number'
                  name='weight'
                  value={profileData.weight}
                  onChange={handleInputChange}
                  required
                />
                <MDBInput
                  wrapperClass='mb-4'
                  label='Age'
                  id='age'
                  type='number'
                  name='age'
                  value={profileData.age}
                  onChange={handleInputChange}
                  required
                />
                <div className='mb-4'>
                  <label className='form-label'>Gender</label>
                  <select
                    className='form-select'
                    name='gender'
                    value={profileData.gender}
                    onChange={handleInputChange}
                    required
                  >
                    <option value='M'>Male</option>
                    <option value='F'>Female</option>
                  </select>
                </div>
                <div className='mb-4'>
                  <label className='form-label'>Skin Tone</label>
                  <select
                    className='form-select'
                    name='skin_tone'
                    value={profileData.skin_tone}
                    onChange={handleInputChange}
                    required
                  >
                    <option value='LT'>Light</option>
                    <option value='MD'>Medium</option>
                    <option value='DK'>Dark</option>
                  </select>
                </div>
                <div className='mb-4'>
                  <label className='form-label'>Upload Image</label>
                  <input
                    type='file'
                    className='form-control'
                    name='captured_image'
                    onChange={handleFileChange}
                    accept='image/*'
                  />
                </div>
                <MDBBtn className='w-100 mb-4' size='md' type='submit'>
                  Create Profile
                </MDBBtn>
              </form>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Profile;
