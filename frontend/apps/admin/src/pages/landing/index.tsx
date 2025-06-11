import { useState } from "react";
import styled from "styled-components";

import AdminLayout from "components/common/AdminLayout";
import SectionToggle, {
  LandingSection,
} from "components/landing/SectionToggle";
import MainImage from "components/landing/MainImage";
import Gallery from "components/landing/Gallery";
import RequireAuth from "components/common/RequireAuth";

const Landing = () => {
  const [landingSection, setLandingSection] = useState<LandingSection>(
    LandingSection.MAIN_IMAGE
  );

  return (
    <AdminLayout>
      <Container>
        <SectionToggle
          onSelect={(section: LandingSection) => {
            setLandingSection(section);
          }}
        />

        {landingSection === LandingSection.MAIN_IMAGE && <MainImage />}
        {landingSection === LandingSection.GALLERY && <Gallery />}
      </Container>
    </AdminLayout>
  );
};

const Container = styled.div`
  padding: 20px;

  background-color: #fff;
`;

export default RequireAuth(Landing);
