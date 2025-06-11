import useSaveBar from "hooks/components/useSaveBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { Pathnames } from "constants/index";
import { FormData } from "pages/channel/form/ChannelForm";
import { useChannelFormContext } from "hooks/channel/context/useChannelFormContext";
import useGetBrands from "hooks/brand/useGetBrands";
import useCreateChannel from "hooks/channel/useCreateChannel";
import useEditChannel from "hooks/channel/useEditChannel";
import { ChannelState } from "interfaces/channels";
import { ChannelFeatureButton } from "constants/common";
import { OWNER } from "configs";
import useSystemModal from "hooks/common/components/useSystemModal";
import useOwnerCookie from "hooks/auth/useOwnerCookie";

interface Errors {
  title?: string;
  description?: string;
  brand_id?: string;
  event_date?: string;
  event_time?: string;
}
interface ChannelPayload {
  title: string;
  brand_id: number;
  description: string;
  event_date: string;
  visible_components: Array<string>;
  channel_state: ChannelState;
}

const Socialing = () => {
  const { isEditMode, formData, setFormData, channelId } =
    useChannelFormContext();
  const { showAnyMessageModal } = useSystemModal();
  const owner = useOwnerCookie();
  const isTester = owner === "tester";

  const { showSaveBar, closeSaveBar } = useSaveBar();
  const { data } = useGetBrands({
    sort_by: null,
    state: null,
    descending: null,
    offset: null,
    limit: null,
  });

  const brands = data?.brands;
  const { mutate: createChannel } = useCreateChannel();
  const { mutate: editChannel } = useEditChannel();

  const navigate = useNavigate();

  const [errors, setErrors] = useState<Errors>({});

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (errors[name as keyof Errors]) {
      setErrors((prevErrors) => {
        const updated = { ...prevErrors };
        delete updated[name as keyof Errors];
        return updated;
      });
    }
    setFormData({
      ...formData,
      [name]: value ? value : null,
    });
  };

  const handleCheckboxChange = (value: ChannelFeatureButton) => {
    if (isTester) {
      showAnyMessageModal("테스터 계정은 권한이 없습니다");
      return;
    }

    setFormData((prevData) => {
      const updatedComponents = prevData.visible_components.includes(value)
        ? prevData.visible_components.filter((item) => item !== value)
        : [...prevData.visible_components, value];
      return { ...prevData, visible_components: updatedComponents };
    });
  };

  const handleSubmit = () => {
    if (isTester) {
      showAnyMessageModal("테스터 계정은 권한이 없습니다");
      return;
    }

    const requiredFields: (keyof FormData)[] = [
      "title",
      "description",
      "brand_id",
      "event_date",
    ];
    const newErrors: Errors = {};

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "이 필드는 필수입니다.";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const rawDate = formData.event_date;
    const time =
      formData.event_time && formData.event_time.trim() !== ""
        ? formData.event_time
        : "00:00";
    const localDateTime = rawDate.includes("T")
      ? rawDate
      : `${rawDate}T${time}`;
    const dateObj = new Date(localDateTime);
    const finalDate = dateObj.toISOString();

    const payload: ChannelPayload = {
      title: formData.title,
      brand_id: formData.brand_id!,
      description: formData.description,
      event_date: finalDate,
      visible_components: formData.visible_components,
      channel_state: ChannelState.ONGOING,
    };

    if (isEditMode && channelId) {
      editChannel(
        { channel_id: channelId, channelData: payload },
        {
          onSuccess: () => {
            navigate(Pathnames.Channel);
          },
        }
      );
      return;
    }

    createChannel(payload, {
      onSuccess: () => {
        navigate(Pathnames.Channel);
      },
    });
  };

  useEffect(() => {
    showSaveBar({
      isVisible: true,
      onSave: handleSubmit,
      buttonText: isEditMode ? "수정" : "저장",
    });
    return () => {
      closeSaveBar();
    };
  }, [showSaveBar, closeSaveBar, isEditMode]);

  return (
    <Container>
      <Section>
        <Title>제목</Title>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Input
            name="title"
            value={formData?.title}
            onChange={handleInputChange}
            placeholder="채널 제목을 입력하세요"
          />
        </div>
        {errors.title && <WarningMessage>{errors.title}</WarningMessage>}
      </Section>

      <Section>
        <Title>설명</Title>
        <div style={{ display: "flex", alignItems: "center" }}>
          <TextArea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="채널 설명을 입력하세요"
          />
        </div>
        {errors.description && (
          <WarningMessage>{errors.description}</WarningMessage>
        )}
      </Section>

      <Section>
        <Title>브랜드</Title>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Dropdown>
            <Select
              name="brand_id"
              value={formData.brand_id ?? ""}
              onChange={handleInputChange}
            >
              <Option value="">브랜드를 선택하세요</Option>
              {brands &&
                brands
                  .filter((brand) => brand.id !== undefined)
                  .map((brand) => (
                    <Option key={brand.id} value={brand.id}>
                      {brand.title}
                    </Option>
                  ))}
            </Select>
          </Dropdown>
        </div>
        {errors.brand_id && <WarningMessage>{errors.brand_id}</WarningMessage>}
      </Section>

      <Section>
        <Title>진행 일정</Title>
        <div style={{ display: "flex", gap: "1rem" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Input
              type="date"
              name="event_date"
              value={formData.event_date}
              onChange={handleInputChange}
              placeholder="날짜 선택"
            />
            {errors.event_date && (
              <WarningMessage>{errors.event_date}</WarningMessage>
            )}
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Input
              type="time"
              name="event_time"
              value={formData.event_time ?? ""}
              onChange={handleInputChange}
              placeholder="시간 선택"
            />
            {errors.event_time && (
              <WarningMessage>{errors.event_time}</WarningMessage>
            )}
          </div>
        </div>
      </Section>
      {isEditMode && (
        <Section>
          <Title style={{ marginBottom: "32px" }}>버튼 노출 설정</Title>
          <Grid>
            {[
              { label: "그룹보기", value: ChannelFeatureButton.GROUP },
              { label: "첫인상 게임", value: ChannelFeatureButton.MATCHLOG },
              {
                label: "컨텐츠 박스",
                value: ChannelFeatureButton.QUESTION_CARD,
              },
              { label: "리뷰남기기", value: ChannelFeatureButton.REVIEW_FORM },
              { label: "후기보기", value: ChannelFeatureButton.REVIEW_LIST },
              {
                label: "후기 작성하기",
                value: ChannelFeatureButton.WRITE_REVIEW,
              },
            ].map((data, index) => (
              <CheckboxWrapper key={index}>
                <span>{data.label}</span>
                <Checkbox onClick={() => handleCheckboxChange(data.value)}>
                  <input
                    type="checkbox"
                    checked={formData.visible_components.includes(data.value)}
                    onChange={() => handleCheckboxChange(data.value)}
                    className="sr-only peer"
                  />
                  <div className="switch"></div>
                </Checkbox>
              </CheckboxWrapper>
            ))}
          </Grid>
        </Section>
      )}
    </Container>
  );
};

const Container = styled.div``;

const Title = styled.h2`
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 128px;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3);
  }
`;

const Dropdown = styled.div`
  width: 100%;
  position: relative;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  outline: none;
  font-size: 1rem;
  background-color: white;
  color: #4b5563;
  &:focus {
    ring: 2px solid #2563eb;
    border-color: #2563eb;
  }
`;

const Option = styled.option`
  padding: 0.75rem;
  font-size: 1rem;
`;

const WarningMessage = styled.div`
  margin-top: 4px;
  color: red;
  font-size: 0.875rem;
`;

const Grid = styled.div`
  display: grid;
  gap: 1rem;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
`;

const Checkbox = styled.label`
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;

  input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  .switch {
    width: 2.75rem;
    height: 1.5rem;
    background-color: #e5e7eb;
    border-radius: 9999px;
    position: relative;
    transition: background-color 0.2s;
  }

  input:checked + .switch {
    background-color: ${({ theme }) => theme.palette.grey700};
  }

  .switch::after {
    content: "";
    width: 1.25rem;
    height: 1.25rem;
    background-color: white;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 2px;
    transform: translateY(-50%);
    transition: transform 0.2s;
  }

  input:checked + .switch::after {
    transform: translate(1.25rem, -50%);
  }
`;

export default Socialing;
