from pydantic import BaseModel, Field
from typing import List

class JobRequest(BaseModel):
    numbers: List[int] = Field(..., min_length=1)

class JobResponse(BaseModel):
    job_id: str
    status: str