from enum import Enum


# 채널의 활성화된 컴포넌트 Enum
class ChannelComponent(str, Enum):
    GROUP = "GROUP"
    MATCHLOG = "MATCHLOG"
    REVIEW_FORM = "REVIEW_FORM"
    REVIEW_LIST = "REVIEW_LIST"
    QUESTION_CARD = "QUESTION_CARD"
    WRITE_REVIEW = "WRITE_REVIEW"

class SurveyQuestionType(str, Enum):
    PLAINTEXT = "PLAINTEXT"
    SELECT = "SELECT"
    DROPDOWN = "DROPDOWN"
    IMAGE = "IMAGE"
    AGREEMENT = "AGREEMENT"

class SurveyRegistState(str, Enum):
    PENDING = "PENDING"
    ACCEPT = "ACCEPT"
    REJECT = "REJECT"

# 추가: 브랜드 상태 Enum
class BrandState(str, Enum):
    ONGOING = "ONGOING"
    FINISH = "FINISH"

# 추가: 채널 상태 Enum
class ChannelState(str, Enum):
    PENDING = "PENDING"
    ONGOING = "ONGOING"
    FULL = "FULL"
    FINISH = "FINISH"

# 추가: 호스트 등록 상태 Enum
class HostRegistState(str, Enum):
    PENDING = "PENDING"
    REJECT = "REJECT"
    ACCEPT = "ACCEPT"
