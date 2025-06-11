import { createContext, useContext } from "react";
import { Channel, ChannelState } from "interfaces/channels";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Output } from "api/channel/hooks/useGetChannels";

interface ChannelTableContextType {
  channelData: Array<Channel>;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<Output, AxiosError<unknown, any>>>;
  filter: {
    limit: number;
    isDescending: boolean;
    state: ChannelState;
  };
  setFilter: React.Dispatch<
    React.SetStateAction<{
      limit: number;
      isDescending: boolean;
      state: ChannelState;
    }>
  >;
}

export const ChannelTableContext = createContext<ChannelTableContextType>(null);

export const useChannelTableContext = (): ChannelTableContextType => {
  const context = useContext(ChannelTableContext);

  if (!context) {
    throw new Error("ChannelTableContext must be used within a BrandProvider");
  }
  return context;
};
