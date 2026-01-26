from pydantic import BaseModel
from typing import List, Optional

class SlideRequest(BaseModel):
    topic: str
    slide_count: int = 10
    style: str = "Professional"

class SlideContent(BaseModel):
    title: str
    content: List[str]
    image_prompt: Optional[str] = None
    image_url: Optional[str] = None

class Presentation(BaseModel):
    topic: str
    slides: List[SlideContent]
