import time
from app.celery_app import celery

@celery.task(bind=True, autoretry_for=(Exception,), retry_backoff=True, max_retries=3)
def process_chunk(self, chunk):
    processed = []

    for number in chunk:
        time.sleep(1)
        processed.append(number * number)

    return {
        "chunk": chunk,
        "processed": processed,
        "partial_sum": sum(processed),
    }

@celery.task
def combine_results(results):
    final_numbers = []
    total_sum = 0

    for item in results:
        final_numbers.extend(item["processed"])
        total_sum += item["partial_sum"]

    return {
        "processed_numbers": final_numbers,
        "total_sum": total_sum,
        "chunks_processed": len(results),
    }