import os

REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379/0")
CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", "3"))