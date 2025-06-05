import { createContext, useContext } from "react";
import { Channel } from "interfaces/channels";
import { FormData } from "pages/channel/form/ChannelForm";

interface ChannelFormContextType {
  channelData: Channel;
  isEditMode: boolean;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  channelId: string;
}

export const ChannelFormContext = createContext<ChannelFormContextType>(null);

export const useChannelFormContext = (): ChannelFormContextType => {
  const context = useContext(ChannelFormContext);

  if (!context) {
    throw new Error("ChannelFormContext must be used within a BrandProvider");
  }
  return context;
};
