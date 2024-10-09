import React from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBTypography, MDBIcon } from 'mdb-react-ui-kit';

export default function PersonalProfile() {
  // Demo data
  const name = "Jane Doe";
  const email = "jane.doe@example.com";
  const skintone = "Light";
  const height = "5'6\"";
  const weight = "55 kg";
  const age = 26;
  const gender = "Female";

  return (
    <section className="vh-100" style={{ backgroundColor: '#f4f5f7' }}>
      <MDBContainer className="py-5 h-100">
        <MDBRow className="justify-content-center align-items-start h-100">
          {/* Left: Profile Information */}
          <MDBCol lg="4" className="mb-4 mb-lg-0">
            <MDBCard className="mb-3" style={{ borderRadius: '.5rem' }}>
              <MDBRow className="g-0">
                <MDBCol md="4" className="gradient-custom text-center text-white"
                  style={{ borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem' }}>
                  <MDBCardImage 
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                    alt="Avatar" 
                    className="my-5" 
                    style={{ width: '100px' }} 
                    fluid 
                  />
                  <MDBTypography tag="h5">{name}</MDBTypography>
                  <MDBCardText>Fashion Enthusiast</MDBCardText>
                  <MDBIcon far icon="edit" className="mb-5" />
                </MDBCol>
                <MDBCol md="8">
                  <MDBCardBody className="p-4">
                    <MDBTypography tag="h6">Profile Information</MDBTypography>
                    <hr className="mt-0 mb-4" />
                    <MDBRow className="pt-1">
                      <MDBCol size="6" className="mb-3">
                        <MDBTypography tag="h6">Email</MDBTypography>
                        <MDBCardText className="text-muted">{email}</MDBCardText>
                      </MDBCol>
                      <MDBCol size="6" className="mb-3">
                        <MDBTypography tag="h6">Skintone</MDBTypography>
                        <MDBCardText className="text-muted">{skintone}</MDBCardText>
                      </MDBCol>
                    </MDBRow>

                    <MDBRow className="pt-1">
                      <MDBCol size="6" className="mb-3">
                        <MDBTypography tag="h6">Height</MDBTypography>
                        <MDBCardText className="text-muted">{height}</MDBCardText>
                      </MDBCol>
                      <MDBCol size="6" className="mb-3">
                        <MDBTypography tag="h6">Weight</MDBTypography>
                        <MDBCardText className="text-muted">{weight}</MDBCardText>
                      </MDBCol>
                    </MDBRow>

                    <MDBRow className="pt-1">
                      <MDBCol size="6" className="mb-3">
                        <MDBTypography tag="h6">Age</MDBTypography>
                        <MDBCardText className="text-muted">{age}</MDBCardText>
                      </MDBCol>
                      <MDBCol size="6" className="mb-3">
                        <MDBTypography tag="h6">Gender</MDBTypography>
                        <MDBCardText className="text-muted">{gender}</MDBCardText>
                      </MDBCol>
                    </MDBRow>

                    <div className="d-flex justify-content-start mt-4">
                      <a href="#!"><MDBIcon fab icon="facebook me-3" size="lg" /></a>
                      <a href="#!"><MDBIcon fab icon="twitter me-3" size="lg" /></a>
                      <a href="#!"><MDBIcon fab icon="instagram me-3" size="lg" /></a>
                    </div>
                  </MDBCardBody>
                </MDBCol>
              </MDBRow>
            </MDBCard>
          </MDBCol>

          {/* Right: My Wardrobe Section */}
          <MDBCol lg="8">
            <MDBTypography tag="h5" className="mb-3">My Wardrobe (Wishlist)</MDBTypography>
            
            {/* Example Wishlist Card */}
            <MDBCard className="mb-3" style={{ borderRadius: '.5rem' }}>
              <MDBRow className="g-0 align-items-center">
                <MDBCol md="4">
                  <MDBCardImage src="https://example.com/product-image.jpg"
                    alt="Wishlist Item" className="img-fluid" style={{ borderRadius: '.5rem', height: '100%' }} />
                </MDBCol>
                <MDBCol md="8">
                  <MDBCardBody>
                    <MDBTypography tag="h5">Product Name</MDBTypography>
                    <MDBTypography tag="h6" className="text-muted">Brand</MDBTypography>
                    <MDBCardText>$50.00</MDBCardText>
                    <MDBCardText>
                      <small className="text-muted">In stock</small>
                    </MDBCardText>
                  </MDBCardBody>
                </MDBCol>
              </MDBRow>
            </MDBCard>

            {/* Add more cards like this for additional products */}
            <MDBCard className="mb-3" style={{ borderRadius: '.5rem' }}>
              <MDBRow className="g-0 align-items-center">
                <MDBCol md="4">
                  <MDBCardImage src="https://example.com/another-product.jpg"
                    alt="Wishlist Item" className="img-fluid" style={{ borderRadius: '.5rem', height: '100%' }} />
                </MDBCol>
                <MDBCol md="8">
                  <MDBCardBody>
                    <MDBTypography tag="h5">Another Product</MDBTypography>
                    <MDBTypography tag="h6" className="text-muted">Another Brand</MDBTypography>
                    <MDBCardText>$75.00</MDBCardText>
                    <MDBCardText>
                      <small className="text-muted">In stock</small>
                    </MDBCardText>
                  </MDBCardBody>
                </MDBCol>
              </MDBRow>
            </MDBCard>

          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}
