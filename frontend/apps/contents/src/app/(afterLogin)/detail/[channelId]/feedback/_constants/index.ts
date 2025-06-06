import { ReviewField } from "../_model";

export const initialState: ReviewField = {
  selectedParticipant: "",
  style: [],
  impression: [],
  conversation: [],
  keywords: [],
  instagram: "",
  kakao: "",
  phoneNumber: "",
  isAnonymous: false, // 기본값: 익명 아님
};

export const styleOptions = [
  "[포멀] \n 깔끔하고 세련된 정장 또는 오피스룩",
  "[캐주얼]\n 편안하고 일상적인 복장",
  "[노멀]\n 튀지 않고 무난한 스타일",
  "[트렌디]\n 최신 유행을 반영한 스타일",
  "[개성적]\n 독특하고 눈에 띄는 스타일",
  "[스포티]\n 활동적이고 운동복 같은 느낌",
  "[미니멀]\n 단순하고 심플한 디자인",
  "[걸리쉬]\n 귀엽고 여성스러운 스타일의 느낌",
  "[시크]\n 심플하면서도 세련된 스타일",
  "[보헤미안]\n 자연스러운 감성과 빈티지 요소가 어우러진 스타일",
  "[스트릿]\n 힙하고 자유로운 느낌의 스타일",
  "[레트로]\n 특정 시대의 복고풍 스타일에서 영감을 받은 스타일",
  "[프레피]\n 미국 아이비리그 스타일에서 영감을 받은 클래식하고 단정한 스타일",
];
export const firstImpressionOptions = [
  "밝고 친근함:\n  환하게 웃으며 다가오는 느낌",
  "차분하고 진지함:\n 신중하면서 안정감이 느껴짐",
  "따뜻하고 배려심 있음:\n 부드럽고 포용력 있는 느낌",
  "조금 긴장된 듯 보임:\n 낯선 상황에서 다소 어색해 보임",
  "무뚝뚝하거나 냉정함:\n 감정을 잘 드러내지 않음",
  "재치 있고 호기심 많아 보임:\n 눈빛에 생기가 있고 적극적임",
  "밝고 명랑함:\n 에너지가 넘치며 긍정적인 분위기를 풍김",
  "신뢰감 있음:\n 안정적이고 믿을 수 있는 인상을 줌",
  "활발하고 적극적임:\n 활기차고 외향적인 느낌으로 분위기를 이끎",
  "약간 소극적임:\n 조금 조심스러워 보이지만 친근함을 느끼게 함",
  "유쾌하고 재치 있음:\n 위트 있는 농담과 활기찬 태도로 분위기를 밝힘",
  "섬세하고 관찰력 있음:\n 작은 디테일까지 잘 캐치하며 세심한 느낌을 줌",
  "차가운 듯 매력 있음:\n 쉽게 다가가기 어렵지만 흥미로운 인상을 남김",
  "잘 모르겠음:\n 특별한 인상을 받지 못함",
];

export const memorablePartOptions = [
  "이야기 내용과 흥미:\n이야기의 주제나 내용이 흥미롭고 사람의 관심을 끌었음. 새로운 정보를 제공하거나 흥미로운 관점을 제시함",
  "공감하고 경청하는 태도:\n 상대방의 말에 집중하고 진지하게 경청하며 공감을 표현함. 상대방이 존중받고 있다는 느낌을 받음",
  "유머와 긍정적인 에너지:\n 대화 중 유머를 섞어 분위기를 밝게 하고 긍정적인 에너지를 전달함. 대화가 즐거웠고 활력을 줌",
  "적극적인 질문과 관심:\n 상대방의 이야기에 적극적으로 질문을 던지며 관심을 보였음",
  "편안하고 자연스러움:\n 대화가 편안하고 자연스러워 아무런 노력 없이 흘러갔음",
  "친절하고 배려심 있는 대화 태도:\n 상대방이 나의 의견을 존중하며 대화에 참여함",
  "자신감 있는 표현:\n 자신의 생각을 명확하고 자신 있게 표현함",
  "개방적이고 포용적인 태도:\n 상대방이 대화 중 나의 의견을 존중하며 나의 생각을 보완하거나 함께 해결책을 찾아보려는 태도를 보였음",
  "창의적이고 상상력 풍부:\n 대화 주제에 대해 창의적이고 상상력 넘치는 생각을 공유하며 상대방을 놀라게 하거나 영감을 줌",
  "차분한 리더십:\n 대화 중 분위기를 잘 조율하고 대화를 이끌어가는 리더십을 발휘. 상대방이 신뢰를 두고 따를 수 있도록 함",
  "감사의 표현:\n 상대방에게 감사의 마음을 표현하며 대화를 마무리함으로써 상대방이 존중받고 고마운 느낌을 받음",
  "침착하고 신중함:\n 대화 중 중요한 주제나 의견에 대해 신중하고 침착하게 답하며 결정적인 순간에 이성을 발휘함",
  "고민과 고민의 공유:\n 자신의 고민을 솔직하게 털어놓으며 상대방과 함께 문제를 고민하는 태도로 공감을 이끌어냄",
  "진정성과 신뢰감:\n 대화 중 진솔하고 일관된 태도를 보이며 신뢰감을 줌. 상대방이 편안하게 자신을 표현할 수 있게 함.",
];

export const keywordOptions = [
  "자신감",
  "편안함",
  "따듯함",
  "엉뚱함",
  "갓생",
  "활기참",
  "평화로움",
  "진지한",
  "인싸",
  "자유로운",
  "공감",
  "긍정",
  "신나는",
  "친절한",
  "배려깊은",
  "고요한",
  "장난스러운",
  "유머러스한",
  "조화로운",
  "열린 마음",
  "책임감",
  "도전정신",
  "창의성",
  "명랑함",
  "훈훈한",
  "위트있는",
  "귀여움",
  "우아한",
  "단정한",
  "이쁜",
];
