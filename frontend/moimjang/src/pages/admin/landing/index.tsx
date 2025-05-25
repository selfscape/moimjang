import { useState } from "react";
import styled from "styled-components";

import AdminLayout from "components/admin/common/AdminLayout";
import SectionToggle, {
  LandingSection,
} from "components/admin/landing/SectionToggle";
import MainImage from "components/admin/landing/MainImage";
import Gallery from "components/admin/landing/Gallery";

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

export default Landing;
