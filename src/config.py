import os
from dotenv import load_dotenv

load_dotenv()

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
DEFAULT_MODEL = os.getenv("DEFAULT_MODEL", "gemini-2.0-flash")
CLERK_JWKS_URL = os.getenv("CLERK_JWKS_URL", "")
CLERK_PUBLISHABLE_KEY = os.getenv("CLERK_PUBLISHABLE_KEY", "")
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
