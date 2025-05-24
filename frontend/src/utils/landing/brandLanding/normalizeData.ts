import { LandingBrand } from "api/landing/type/landingBrand";
import { LandingChannel } from "api/landing/type/landingChannels";
import { BrandReview } from "api/admin/brand/types/brandReview";
import { Image } from "api/landing/type/landingBrand";

interface ScheduleEntry {
  id: number;
  month: string;
  date: string;
  day: string;
  time: string;
}

type SchedulesByMonth = Record<string, ScheduleEntry[]>;

export interface NormalizeDataOutput {
  thumbnail: string;
  title: string;
  description: string;
  meetingLocation: string;
  schedulesByMonth: SchedulesByMonth;
  photoReviews: Array<PhotoReviewItem>;
  detailImages: Array<Image>;
  maxParticipants: number;
  socialingDuration: number;
}

interface PhotoReviewItem {
  id: number;
  userName: string;
  userGender: string;
  images: string[];
  reviewContent: string;
}

const normalizeData = (
  landingBrandData: LandingBrand,
  landingChannelData: Array<LandingChannel>,
  brandReviewData: Array<BrandReview>
): NormalizeDataOutput => {
  const thumbnail = landingBrandData?.thumbnailImage?.url || null;
  const title = landingBrandData?.title || "";
  const description = landingBrandData?.description || "";
  const meetingLocation = landingBrandData?.meeting_location || "";
  const socialingDuration = landingBrandData?.socialing_duration || 0;
  const maxParticipants = landingBrandData?.max_participants || 0;
  const schedulesByMonth = getSchedulesByMonth(landingChannelData);
  const photoReviews = getReviews(brandReviewData);
  const detailImages =
    landingBrandData?.detailImages.length > 0
      ? landingBrandData?.detailImages
      : [];

  return {
    thumbnail,
    title,
    maxParticipants,
    description,
    meetingLocation,
    socialingDuration,
    schedulesByMonth,
    photoReviews,
    detailImages,
  };
};

export default normalizeData;

const getSchedulesByMonth = (channelList: Array<LandingChannel>) => {
  if (!channelList) return {} as SchedulesByMonth;

  return channelList?.reduce((acc, channel) => {
    const dateObj = new Date(channel.event_date);
    const month = (dateObj.getMonth() + 1).toString();
    const date = dateObj.getDate().toString();
    const day = dateObj.toLocaleDateString("ko-KR", { weekday: "short" });
    const time = dateObj.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const entry = { id: channel.id, month, date, day, time };
    if (!acc[month]) acc[month] = [];
    acc[month].push(entry);
    return acc;
  }, {} as SchedulesByMonth);
};

export const getReviews = (brandReviewData: Array<BrandReview>) => {
  if (!brandReviewData) return [];
  return brandReviewData
    .filter((review) => review.imageList && review.imageList.length > 0)
    .map((review) => ({
      id: review.id,
      userName: review?.user?.username,
      userGender: review?.user?.gender,
      images: review.imageList.map((img) => img.url),
      reviewContent: review.contents,
    }));
};
