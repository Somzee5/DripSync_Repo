import React from 'react';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBBtn,
} from 'mdb-react-ui-kit';

const Home = ({ firstName }) => {
  return (
    <MDBContainer fluid className="p-4 background-radial-gradient overflow-hidden">
      <MDBRow>
        <MDBCol md="12" className="d-flex flex-column justify-content-center align-items-center">
          <MDBCard className="bg-glass text-center my-5">
            <MDBCardBody>
              <MDBCardTitle className="display-3 fw-bold">Welcome to DripSync, {firstName}!</MDBCardTitle>
              <MDBCardText className="mt-4">
                Unlock personalized outfit suggestions tailored to your style and body type. Dive into the world of fashion with DripSync!
              </MDBCardText>
              <MDBBtn className="mt-3" color="primary" size="lg">
                Explore Outfits
              </MDBBtn>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Home;
