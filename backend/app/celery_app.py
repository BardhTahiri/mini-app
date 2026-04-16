from celery import Celery
from app.config import REDIS_URL

celery = Celery(
    "worker",
    broker=REDIS_URL,
    backend=REDIS_URL,
)

celery.conf.update(
    task_track_started=True,
    result_expires=3600,
)

celery.autodiscover_tasks(["app"])
