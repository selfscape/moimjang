from typing import Optional, TypeVar, Protocol, Union

class ImageProtocol(Protocol):    
    path: str
    id: int

TImage = TypeVar("TImage", bound=ImageProtocol)

class EmptyImage:
    """
    이미지 객체가 None일 때 대신 반환되는 빈(더미) 이미지 객체입니다.
    경로에 접근하면 빈 문자열("")을 반환합니다.
    """
    def __init__(self) -> None:
        self.id = -999
        self.path = ""
        

def safe_image(image: Optional[TImage]) -> TImage | ImageProtocol:
    """
    이미지 객체가 None인 경우, 빈 이미지 객체를 반환하여 path 속성에 안전하게 접근할 수 있도록 합니다.
    
    매개변수:
        image: 실제 이미지 객체 또는 None

    반환값:
        이미지 객체가 None이면 EmptyImage 인스턴스를 반환하고, 그렇지 않으면 원본 이미지를 반환합니다.
    """
    if image is None:
        return EmptyImage()
    return image