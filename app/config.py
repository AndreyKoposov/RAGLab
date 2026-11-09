from os import getenv
from dotenv import load_dotenv

# ROOT = Path(abspath(__file__)).parent.parent
# # TEMPLATES = Jinja2Templates(directory='src/static/templates')

# load_dotenv(ROOT/'.env', encoding='utf-8')
load_dotenv()

AI_ENGINE = getenv('AI_ENGINE', default='')
print(AI_ENGINE)
AI_MODEL = getenv('AI_MODEL', '')
AI_API_KEY = getenv('AI_API_KEY', '')
AI_TEMP = getenv('AI_TEMP', '')

DB_NAME = getenv('DB_NAME', '')
DB_USER = getenv('DB_USER', '')
DB_PSWRD = getenv('DB_PSWRD', '')
DB_HOST = getenv('DB_HOST', '')
DB_PORT = getenv('DB_PORT', '')

DEBUG = getenv('DEBUG')
