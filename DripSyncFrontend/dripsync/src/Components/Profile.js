import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api'; // Assuming you are using axios for HTTP requests

const Profile = () => {
    const { user_id } = useParams();
    const [userProfile, setUserProfile] = useState(null);
  
    useEffect(() => {
      const fetchUserProfile = async () => {
        try {
          const response = await api.get(`/profile/${user_id}/`);
          setUserProfile(response.data.profile);
        } catch (error) {
          console.log("Error fetching profile", error);
        }
      };
  
      fetchUserProfile();
    }, [user_id]);
  
    if (!userProfile) return <div>Loading...</div>;
  
    return (
      <div>
        <h1>{userProfile.email}'s Profile</h1>
        {/* Display more profile details here */}
      </div>
    );
  };
  

export default Profile;
