**Frontend**

npm install

npm run dev

**Backend**
1. Set Up a Virtual Environment

  python -m venv venv
  .\venv\Scripts\Activate.ps1

2. Install Dependencies

  pip install -r requirements.txt

3. Bootstrap and Train the ML Models

  python run.py

4. Start the API Server

  python -m uvicorn api.main:app --reload --host 127.0.0.1 --port 8000