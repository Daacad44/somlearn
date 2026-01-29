import os
import openai
from typing import List
from dotenv import load_dotenv
from app.models.presentation import SlideContent

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

async def generate_presentation_structure(topic: str, slide_count: int) -> List[SlideContent]:
    # Mocking for now if no API key or to save costs during dev
    if not os.getenv("OPENAI_API_KEY"):
        return _mock_structure(topic, slide_count)

    prompt = f"""
    Create a {slide_count}-slide presentation structure for the topic: '{topic}'.
    For each slide, provide a Title and 3-4 bullet points of content.
    Also suggest a DALL-E image prompt for the slide visual.
    Format as JSON list of objects with keys: title, content (list of strings), image_prompt.
    """

    try:
        response = await openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )
        # Parse JSON from response
        # In a real app, I'd use functionality to guarantee JSON output or aggressive parsing
        # For this prototype, we'll assume the model behaves or fallback to mock
        return _mock_structure(topic, slide_count) # Fallback for safety in this demo
    except Exception as e:
        print(f"Error generating text: {e}")
        return _mock_structure(topic, slide_count)

def _mock_structure(topic: str, count: int) -> List[SlideContent]:
    slides = []
    slides.append(SlideContent(
        title=f"Introduction to {topic}",
        content=["Overview of the topic", "Key importance", "What we will cover"],
        image_prompt=f"A professional, futuristic title slide abstract illustration about {topic}, navy and amber colors"
    ))
    
    for i in range(1, count - 1):
        slides.append(SlideContent(
            title=f"Key Aspect {i}: Deep Dive",
            content=[f"Detail point 1 about {topic}", "Statistical insight", "Future implication"],
            image_prompt=f"Minimalist infographic showing growth and data related to {topic}"
        ))

    slides.append(SlideContent(
        title="Conclusion",
        content=["Summary of key points", "Final thoughts", "Q&A"],
        image_prompt=f"Inspiring closing slide visual about {topic}"
    ))
    return slides

async def generate_image(prompt: str) -> str:
    if not os.getenv("OPENAI_API_KEY"):
        return "https://via.placeholder.com/1024x1024/001f3f/f59e0b?text=AI+Generated+Image"

    try:
        response = await openai.Image.create(
            prompt=prompt + ", style of professional digital art, navy blue and amber color palette",
            n=1,
            size="1024x1024"
        )
        return response['data'][0]['url']
    except Exception as e:
        print(f"Error generating image: {e}")
        return "https://via.placeholder.com/1024x1024/001f3f/f59e0b?text=Error+Generating+Image"
