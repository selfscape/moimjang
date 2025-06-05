export const extractContact = (info: string) => {
  if (!info) return { instagram: "", kakao: "", phone: "" };
  const instagramMatch = info.match(/Instagram:\s*([^,]+)/i);
  const kakaoMatch = info.match(/Kakao:\s*([^,]+)/i);
  const phoneMatch = info.match(/Phone:\s*([^\s,]+)/i);
  return {
    instagram: instagramMatch ? instagramMatch[1].trim() : "",
    kakao: kakaoMatch ? kakaoMatch[1].trim() : "",
    phone: phoneMatch ? phoneMatch[1].trim() : "",
  };
};

export const parseList = (text: string) =>
  text
    ? text
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
