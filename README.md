# Mini App

Tiny demo app for distributed background computation with FastAPI, Celery, Redis, React, and Docker Compose.

## What It Does

- Accepts a list of numbers from the frontend
- Sends the computation to Celery through a FastAPI endpoint
- Splits the list into chunks and processes them in parallel
- Lets the frontend poll the job by `job_id`
- Displays status and a formatted result summary in the UI

## Stack

- Backend: FastAPI
- Background jobs: Celery
- Broker and result backend: Redis
- Frontend: React + Vite
- Container orchestration: Docker Compose
- Monitoring: Flower

## Project Structure

```text
mini-app/
|- backend/
|  |- app/
|  |  |- celery_app.py
|  |  |- config.py
|  |  |- main.py
|  |  |- schemas.py
|  |  |- tasks.py
|  |  `- utils.py
|  |- Dockerfile
|  `- requirements.txt
|- frontend/
|  |- public/
|  |- src/
|  |  |- api.js
|  |  |- App.jsx
|  |  |- main.jsx
|  |  `- styles.css
|  |- Dockerfile
|  |- index.html
|  |- nginx.conf
|  |- package-lock.json
|  |- package.json
|  `- vite.config.js
|- .env
|- docker-compose.yml
|- Project.txt
`- README.md
```

## Services

- Frontend: `http://localhost:3002`
- FastAPI API: `http://localhost:8000`
- FastAPI docs: `http://localhost:8000/docs`
- Flower: `http://localhost:5555`
- Redis: `localhost:6379`

## Environment Variables

The root `.env` file is used by Docker Compose.

```env
REDIS_URL=redis://redis:6379/0
CHUNK_SIZE=3
```

- `REDIS_URL`: Redis connection used by the API, worker, and Flower
- `CHUNK_SIZE`: how many numbers go into each parallel Celery task

## How It Works

1. The frontend sends a list of numbers to `POST /jobs`
2. FastAPI splits the list into chunks using `CHUNK_SIZE`
3. Celery runs one `process_chunk` task per chunk in parallel
4. When all chunks finish, `combine_results` merges the outputs
5. FastAPI exposes `GET /jobs/{job_id}` so the frontend can poll status
6. The frontend shows the job status and final result

Example final result:

```json
{
  "processed_numbers": [1, 4, 9, 16, 25, 36],
  "total_sum": 91,
  "chunks_processed": 2
}
```

## API Endpoints

### `GET /health`

Returns a simple health response:

```json
{
  "status": "ok"
}
```

### `POST /jobs`

Request body:

```json
{
  "numbers": [1, 2, 3, 4, 5, 6]
}
```

Response:

```json
{
  "job_id": "<celery-job-id>",
  "status": "PENDING"
}
```

### `GET /jobs/{job_id}`

Example success response:

```json
{
  "job_id": "<celery-job-id>",
  "status": "SUCCESS",
  "result": {
    "processed_numbers": [1, 4, 9, 16, 25, 36],
    "total_sum": 91,
    "chunks_processed": 2
  }
}
```

## Run Locally

From the project root:

```bash
docker compose up --build
```

Then open:

- `http://localhost:3002`

## Example Flow

1. Enter `1, 2, 3, 4, 5, 6` in the frontend
2. Click `Submit Job`
3. The app returns a `job_id`
4. Status moves through `PENDING`, `STARTED`, and `SUCCESS`
5. The result panel shows:
   - `Processed Numbers`
   - `Total Sum`
   - `Chunks Processed`
   - optional full JSON via `See Full JSON`

## Notes

- The UI currently shows job state, not true percentage-based progress
- `process_chunk` simulates expensive work with a 1-second delay per number
- Flower can be used to inspect Celery activity while jobs run
