# Somlearn Backend

## Requirements
- Python 3.10+
- OpenAI API Key

## Setup Instructions

1. **Create Virtual Environment**
   ```bash
   # Windows
   python -m venv venv
   
   # Mac/Linux
   python3 -m venv venv
   ```

2. **Activate Environment**
   ```bash
   # Windows
   .\venv\Scripts\activate
   
   # Mac/Linux
   source venv/bin/activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Variables**
   Create a `.env` file in this directory:
   ```env
   OPENAI_API_KEY=your_key_here
   ```

5. **Run Server**
   ```bash
   uvicorn main:app --reload
   ```

## API Documentation
Once running, visit `http://localhost:8000/docs` for Swagger UI.
