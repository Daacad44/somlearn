from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse
from app.models.presentation import SlideRequest, Presentation
from app.services.openai_service import generate_presentation_structure, generate_image
from app.services.ppt_generator import create_presentation
import io

router = APIRouter()

@router.post("/generate", response_model=Presentation)
async def generate_structure(request: SlideRequest):
    """
    Step 1: Generate the structure of the presentation (text content).
    Returns the JSON data for the frontend to preview.
    """
    slides = await generate_presentation_structure(request.topic, request.slide_count)
    return Presentation(topic=request.topic, slides=slides)

@router.post("/download")
async def download_presentation(data: Presentation):
    """
    Step 2: Convert the JSON structure + Images into a PPTX file.
    """
    # In a full flow, we might generate images asynchronously here or assume they are passed in
    try:
        ppt_file = create_presentation(data.topic, data.slides)
        
        headers = {
            'Content-Disposition': f'attachment; filename="{data.topic}.pptx"'
        }
        
        return StreamingResponse(
            ppt_file, 
            media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
            headers=headers
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
