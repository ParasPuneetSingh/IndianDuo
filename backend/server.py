from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from motor.motor_asyncio import AsyncIOMotorClient
import os
import uuid
from dotenv import load_dotenv

load_dotenv()

# Configuration
MONGO_URL = os.getenv("MONGO_URL")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# FastAPI app
app = FastAPI(title="IndianDuo API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
client = AsyncIOMotorClient(MONGO_URL)
db = client.indianduo

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

# Models
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    native_language: str
    learning_language: str

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class User(BaseModel):
    id: str
    username: str
    email: str
    native_language: str
    learning_language: str
    total_xp: int = 0
    current_streak: int = 0
    longest_streak: int = 0
    last_lesson_date: Optional[datetime] = None
    created_at: datetime
    level: int = 1
    hearts: int = 5
    gems: int = 0
    friends: List[str] = []
    achievements: List[str] = []

class Language(BaseModel):
    id: str
    name: str
    code: str
    native_name: str
    flag: str
    total_lessons: int = 0
    difficulty_level: str = "beginner"

class Lesson(BaseModel):
    id: str
    language_id: str
    unit_id: str
    title: str
    description: str
    type: str  # reading, writing, speaking, listening
    difficulty: int
    xp_reward: int
    exercises: List[str] = []
    prerequisites: List[str] = []
    is_locked: bool = True

class Exercise(BaseModel):
    id: str
    lesson_id: str
    type: str  # multiple_choice, fill_blank, translation, audio_match, etc.
    question: str
    options: List[str] = []
    correct_answer: str
    explanation: str = ""
    audio_url: str = ""
    image_url: str = ""
    difficulty: int

class UserProgress(BaseModel):
    id: str
    user_id: str
    lesson_id: str
    completed: bool = False
    score: int = 0
    attempts: int = 0
    completed_at: Optional[datetime] = None
    mistakes: List[str] = []

# Utility functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = await db.users.find_one({"username": username})
    if user is None:
        raise credentials_exception
    return user

# Initialize languages
async def init_languages():
    languages = [
        {"id": str(uuid.uuid4()), "name": "Hindi", "code": "hi", "native_name": "हिन्दी", "flag": "🇮🇳"},
        {"id": str(uuid.uuid4()), "name": "Tamil", "code": "ta", "native_name": "தமிழ்", "flag": "🇮🇳"},
        {"id": str(uuid.uuid4()), "name": "Telugu", "code": "te", "native_name": "తెలుగు", "flag": "🇮🇳"},
        {"id": str(uuid.uuid4()), "name": "Bengali", "code": "bn", "native_name": "বাংলা", "flag": "🇮🇳"},
        {"id": str(uuid.uuid4()), "name": "Kannada", "code": "kn", "native_name": "ಕನ್ನಡ", "flag": "🇮🇳"},
        {"id": str(uuid.uuid4()), "name": "Marathi", "code": "mr", "native_name": "मराठी", "flag": "🇮🇳"},
        {"id": str(uuid.uuid4()), "name": "Sanskrit", "code": "sa", "native_name": "संस्कृत", "flag": "🇮🇳"},
        {"id": str(uuid.uuid4()), "name": "English", "code": "en", "native_name": "English", "flag": "🇬🇧"},
        {"id": str(uuid.uuid4()), "name": "Gujarati", "code": "gu", "native_name": "ગુજરાતી", "flag": "🇮🇳"},
        {"id": str(uuid.uuid4()), "name": "Punjabi", "code": "pa", "native_name": "ਪੰਜਾਬੀ", "flag": "🇮🇳"},
    ]
    
    for language in languages:
        existing = await db.languages.find_one({"code": language["code"]})
        if not existing:
            await db.languages.insert_one(language)

# API Routes
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

@app.post("/api/auth/register", response_model=Token)
async def register(user: UserCreate):
    # Check if user already exists
    existing_user = await db.users.find_one({"$or": [{"username": user.username}, {"email": user.email}]})
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Username or email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    user_data = {
        "id": str(uuid.uuid4()),
        "username": user.username,
        "email": user.email,
        "password": hashed_password,
        "native_language": user.native_language,
        "learning_language": user.learning_language,
        "total_xp": 0,
        "current_streak": 0,
        "longest_streak": 0,
        "last_lesson_date": None,
        "created_at": datetime.utcnow(),
        "level": 1,
        "hearts": 5,
        "gems": 0,
        "friends": [],
        "achievements": []
    }
    
    await db.users.insert_one(user_data)
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/auth/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await db.users.find_one({"username": form_data.username})
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/user/profile")
async def get_user_profile(current_user: dict = Depends(get_current_user)):
    user_data = current_user.copy()
    user_data.pop("password", None)
    return user_data

@app.get("/api/languages")
async def get_languages():
    languages = await db.languages.find({}).to_list(None)
    return languages

@app.get("/api/lessons/{language_id}")
async def get_lessons(language_id: str, current_user: dict = Depends(get_current_user)):
    lessons = await db.lessons.find({"language_id": language_id}).to_list(None)
    return lessons

@app.post("/api/lessons/{lesson_id}/complete")
async def complete_lesson(lesson_id: str, score: int, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    
    # Update user progress
    progress_data = {
        "id": str(uuid.uuid4()),
        "user_id": user_id,
        "lesson_id": lesson_id,
        "completed": True,
        "score": score,
        "attempts": 1,
        "completed_at": datetime.utcnow(),
        "mistakes": []
    }
    
    await db.user_progress.insert_one(progress_data)
    
    # Update user XP and streak
    lesson = await db.lessons.find_one({"id": lesson_id})
    if lesson:
        xp_gained = lesson.get("xp_reward", 10)
        
        # Check if lesson was completed today
        today = datetime.utcnow().date()
        last_lesson_date = current_user.get("last_lesson_date")
        
        if last_lesson_date and last_lesson_date.date() == today:
            # Same day, just add XP
            await db.users.update_one(
                {"id": user_id},
                {"$inc": {"total_xp": xp_gained}}
            )
        else:
            # New day, update streak
            current_streak = current_user.get("current_streak", 0)
            if last_lesson_date and (today - last_lesson_date.date()).days == 1:
                # Consecutive day
                new_streak = current_streak + 1
            else:
                # Break in streak
                new_streak = 1
            
            await db.users.update_one(
                {"id": user_id},
                {
                    "$inc": {"total_xp": xp_gained},
                    "$set": {
                        "current_streak": new_streak,
                        "longest_streak": max(new_streak, current_user.get("longest_streak", 0)),
                        "last_lesson_date": datetime.utcnow()
                    }
                }
            )
    
    return {"message": "Lesson completed successfully", "xp_gained": xp_gained}

@app.on_event("startup")
async def startup_event():
    await init_languages()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)