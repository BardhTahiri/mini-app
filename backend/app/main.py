from fastapi import FastAPI, HTTPException
from celery import chord
from celery.result import AsyncResult

from app.celery_app import celery
from app.schemas import JobRequest
from app.tasks import process_chunk, combine_results
from app.utils import chunk_numbers

app = FastAPI(
    title="Mini Distributed Computation API",
    version="1.0.0"
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/jobs")
def create_job(payload: JobRequest):
    numbers = payload.numbers

    if not numbers:
        raise HTTPException(status_code=400, detail="Numbers list cannot be empty.")

    chunks = chunk_numbers(numbers)

    job = chord(process_chunk.s(chunk) for chunk in chunks)(combine_results.s())

    return {
        "job_id": job.id,
        "status": "PENDING",
    }

@app.get("/jobs/{job_id}")
def get_job(job_id: str):
    result = AsyncResult(job_id, app=celery)

    response = {
        "job_id": job_id,
        "status": result.status,
    }

    if result.successful():
        response["result"] = result.result
    elif result.failed():
        response["error"] = str(result.result)

    return response