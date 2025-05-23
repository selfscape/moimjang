import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";

import { ChannelState } from "api/admin/channel/type/channel";
import useGetChannelList from "hooks/consumer/hook/useGetChannelList";
import useGetMyInfo from "hooks/consumer/useGetMyInfo";
import useHeader from "hooks/consumer/components/useHeader";
import userState from "recoils/atoms/auth/userState";

import ConsumerLayout from "components/consumer/common/ConsumerLayout";
import BrandInfo from "components/consumer/home/BrandInfo";

const Home: React.FC = () => {
  const { header } = useHeader();
  const { data: channelListData, refetch } = useGetChannelList({
    state: ChannelState.ONGOING,
  });

  const { data: myInfoData, isSuccess } = useGetMyInfo();
  const [_, setUserData] = useRecoilState(userState);

  useEffect(() => {
    if (isSuccess) {
      setUserData(myInfoData);
    }
  }, [myInfoData, isSuccess]);

  useEffect(() => {
    header({
      visible: true,
      title: "채널",
      onRefresh: refetch,
    });
  }, []);

  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - 2);

  const channelList = channelListData?.channels;

  return (
    <ConsumerLayout>
      <ChannelList>
        {channelList?.map((channel) => (
          <BrandInfo
            key={channel.id}
            brandId={channel.brand_id}
            channelData={channel}
          />
        ))}
      </ChannelList>
    </ConsumerLayout>
  );
};
const ChannelList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export default Home;
