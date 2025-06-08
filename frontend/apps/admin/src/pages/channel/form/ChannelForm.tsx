import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import { ChannelFeatureButton } from "constants/common";
import useGetChannelById from "hooks/channel/useGetChannelById";
import { ChannelFormContext } from "hooks/channel/context/useChannelFormContext";

import AdminLayout from "components/common/AdminLayout";
import SectionToggle, {
  ChannelSection,
} from "components/channel/channelDetail/SectionToggle";
import Application from "components/channel/channelDetail/application";
import Game from "components/channel/channelDetail/game";
import Socialing from "components/channel/channelDetail/socialing";
import RequireAuth from "components/common/RequireAuth";

export interface FormData {
  title: string;
  description: string;
  brand_id: number | null;
  event_date: string;
  visible_components: Array<ChannelFeatureButton>;
  event_time?: string;
}

const ChannelForm: React.FC = () => {
  const { channelId } = useParams<{ channelId?: string }>();
  const isEditMode = Boolean(channelId);
  const { data: channelData } = useGetChannelById();
  const [channelSection, setChannelSection] = useState<ChannelSection>(
    ChannelSection.SOCIALING
  );

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    brand_id: null,
    event_date: "",
    visible_components: [],
    event_time: "",
  });

  useEffect(() => {
    if (!channelData) return;

    let rawDate = channelData.event_date || "";
    let dateOnly = rawDate;
    let timeOnly = "";

    if (rawDate.includes("T")) {
      const [datePart, timeWithZone] = rawDate.split("T");
      dateOnly = datePart;
      let timePortion = timeWithZone.split(/[Z+-]/)[0];
      timeOnly = timePortion.slice(0, 5);
    }

    setFormData({
      title: channelData.title || "",
      description: channelData.description || "",
      brand_id: channelData.brand_id,
      visible_components: channelData.visible_components,
      event_date: dateOnly,
      event_time: timeOnly,
    });
  }, [isEditMode, channelData]);

  return (
    <AdminLayout>
      <ChannelFormContext.Provider
        value={{ channelData, isEditMode, formData, setFormData, channelId }}
      >
        <Container>
          <SectionToggle
            onSelect={(section: ChannelSection) => {
              setChannelSection(section);
            }}
          />
          <MainContent>
            {channelSection === ChannelSection.SOCIALING && <Socialing />}
            {channelSection === ChannelSection.APPLICATION && <Application />}
            {channelSection === ChannelSection.GAME && <Game />}
          </MainContent>
        </Container>
      </ChannelFormContext.Provider>
    </AdminLayout>
  );
};

const Container = styled.div`
  padding: 1.5rem;
  background-color: #f9fafb;
`;

const MainContent = styled.main`
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

export default RequireAuth(ChannelForm);
