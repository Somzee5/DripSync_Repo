import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBTypography, MDBIcon, MDBBtn } from 'mdb-react-ui-kit';
import api from '../utils/api'; 

export default function PersonalProfile() {
  const { user_id } = useParams(); // Extract user ID from route
  const history = useHistory(); // Initialize useHistory
  const [profile, setProfile] = useState({});
  const [wardrobe, setWardrobe] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user profile and wardrobe data based on user_id
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get(`/myprofile/${user_id}`);
        setProfile(response.data.profile); // Set the profile data
        setWardrobe(response.data.wardrobe); // Set the wardrobe data
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } 
    };
    fetchUserProfile();
  }, [user_id]);

  // Function to handle removal of an item from wardrobe
  const handleRemoveFromWardrobe = async (Id_Product) => {
    try {
      await api.delete(`/wardrobe/${Id_Product}`); // Call delete API
      // Filter out the removed item from wardrobe state
      setWardrobe(wardrobe.filter((item) => item.Id_Product !== Id_Product));
    } catch (error) {
      console.error('Error removing item from wardrobe:', error);
    }
  };

  // Function to handle logout
  const handleLogout = () => {
    sessionStorage.removeItem('access_token'); // Remove access token
    sessionStorage.removeItem('user_id'); // Remove user ID
    history.push('/'); // Redirect to login page
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="vh-100" style={{ backgroundColor: '#f4f5f7' }}>
      <MDBContainer className="py-5 h-100">
        <MDBRow className="justify-content-center align-items-start h-100">
          {/* Left: Profile Information */}
          <MDBCol lg="5" className="mb-4 mb-lg-0"> {/* Changed lg from 4 to 5 */}
            <MDBCard className="mb-3" style={{ borderRadius: '.5rem', width: '100%' }}> {/* Added width: 100% */}
              <MDBRow className="g-0">
                <MDBCol md="9" className="gradient-custom text-center text-white"
                  style={{ borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem' }}>
                  <MDBCardImage 
                    src={profile.captured_image ? `http://127.0.0.1:8000${profile.captured_image}` : "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"}
                    alt="Avatar" 
                    className="my-5" 
                    style={{ width: '100px' }} 
                    fluid 
                  />
                  <MDBTypography tag="h5">{profile.name}</MDBTypography>
                  <MDBCardText>{profile.bio || 'Fashion Enthusiast'}</MDBCardText>
                  <MDBIcon far icon="edit" className="mb-5" />
                </MDBCol>
                <MDBCol md="8">
                  <MDBCardBody className="p-4">
                    <MDBTypography tag="h6">Profile Information</MDBTypography>
                    <hr className="mt-0 mb-4" />
                    <MDBRow className="pt-1">
                      <MDBCol size="6" className="mb-3">
                        <MDBTypography tag="h6">Email</MDBTypography>
                        <MDBCardText className="text-muted">{profile.email}</MDBCardText>
                      </MDBCol>
                      <MDBCol size="6" className="mb-3">
                        <MDBTypography tag="h6">Skintone</MDBTypography>
                        <MDBCardText className="text-muted">{profile.skin_tone}</MDBCardText>
                      </MDBCol>
                    </MDBRow> 

                    <MDBRow className="pt-1">
                      <MDBCol size="6" className="mb-3">
                        <MDBTypography tag="h6">Height</MDBTypography>
                        <MDBCardText className="text-muted">{profile.height}</MDBCardText>
                      </MDBCol>
                      <MDBCol size="6" className="mb-3">
                        <MDBTypography tag="h6">Weight</MDBTypography>
                        <MDBCardText className="text-muted">{profile.weight}</MDBCardText>
                      </MDBCol>
                    </MDBRow>

                    <MDBRow className="pt-1">
                      <MDBCol size="6" className="mb-3">
                        <MDBTypography tag="h6">Age</MDBTypography>
                        <MDBCardText className="text-muted">{profile.age}</MDBCardText>
                      </MDBCol>
                      <MDBCol size="6" className="mb-3">
                        <MDBTypography tag="h6">Gender</MDBTypography>
                        <MDBCardText className="text-muted">{profile.gender}</MDBCardText>
                      </MDBCol>
                      <MDBCol size="6" className="mb-3">
                        <MDBTypography tag="h6">Waist</MDBTypography>
                        <MDBCardText className="text-muted">{profile.waist}</MDBCardText>
                      </MDBCol>
                    </MDBRow>
                    {/* Logout Button */}
                    <MDBBtn className="mt-4" onClick={handleLogout}>Logout</MDBBtn>
                  </MDBCardBody>
                </MDBCol>
              </MDBRow>
            </MDBCard>
          </MDBCol>

          {/* Right: My Wardrobe Section */}
          <MDBCol lg="7"> {/* Changed lg from 8 to 7 */}
            <MDBTypography tag="h5" className="mb-3">My Wardrobe (Wishlist)</MDBTypography>
            {wardrobe.length > 0 ? (
              wardrobe.map((item) => (
                <MDBCard className="mb-3" style={{ borderRadius: '.5rem', width: '100%' }} key={item.Id_Product}> {/* Added width: 100% */}
                  <MDBRow className="g-0 align-items-center">
                    <MDBCol md="4">
                      <MDBCardImage 
                        src={item.URL_image || "https://via.placeholder.com/150"}
                        alt="Wardrobe Item" 
                        className="img-fluid" 
                        style={{ borderRadius: '.5rem', height: '100%' }} 
                      />
                    </MDBCol>
                    <MDBCol md="8">
                      <MDBCardBody>
                        <MDBTypography tag="h5">{item.Description}</MDBTypography>
                        <MDBTypography tag="h6" className="text-muted">Price: ${item.Price}</MDBTypography>
                        <MDBCardText><small className="text-muted">Added on: {new Date(item.added_date).toLocaleDateString()}</small></MDBCardText>
                        
                        {/* Replace product URL with a Buy Now button */}
                        <MDBCardText>
                          <a href={item.Product_URL} target="_blank" rel="noreferrer">
                            <button className="btn btn-primary">Buy Now</button>
                          </a>
                        </MDBCardText>

                        {/* Remove item from wardrobe */}
                        <MDBCardText>
                          <button className="btn btn-danger" onClick={() => handleRemoveFromWardrobe(item.Id_Product)}>
                            Remove
                          </button>
                        </MDBCardText>
                      </MDBCardBody>
                    </MDBCol>
                  </MDBRow>
                </MDBCard>
              ))
            ) : (
              <MDBTypography tag="h6" className="text-muted">No items in wardrobe</MDBTypography>
            )}
          </MDBCol>

        </MDBRow>
      </MDBContainer>
    </section>
  );
}