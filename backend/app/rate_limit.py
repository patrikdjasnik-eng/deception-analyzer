import asyncio
from collections import deque
from time import monotonic


class RateLimiter:
  def __init__(self, limit: int, window_seconds: float) -> None:
    self.limit = limit
    self.window_seconds = window_seconds
    self.buckets: dict[str, deque[float]] = {}
    self.lock = asyncio.Lock()

  async def allow(self, key: str) -> bool:
    now = monotonic()

    async with self.lock:
      if len(self.buckets) > 4096:
        self.buckets = {
          name: values for name, values in self.buckets.items()
          if values and now - values[-1] < self.window_seconds
        }

      hits = self.buckets.setdefault(key, deque())

      while hits and now - hits[0] >= self.window_seconds:
        hits.popleft()

      if len(hits) >= self.limit:
        return False

      hits.append(now)
      return True
