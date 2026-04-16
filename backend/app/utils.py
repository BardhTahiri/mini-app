from app.config import CHUNK_SIZE

def chunk_numbers(numbers):
    return [numbers[i:i + CHUNK_SIZE] for i in range(0, len(numbers), CHUNK_SIZE)]