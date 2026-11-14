import requests
from openai import OpenAI

from . import engine


class QwenEngine(engine.AIEngine):
    def __init__(self, key: str, model: str, temp: float) -> None:
        super().__init__(1)

        self.model = model
        self.qwen = OpenAI(
            api_key=key,
            base_url="https://link.fwd.su/martha/v1"
        )

    def chat(self, query: str) -> str:
        response = self.qwen.responses.create(
            model=self.model,
            input=query,
        )

        for item in response.output:
            if item.type == "message" and item.content[0]:
                return str(getattr(item.content[0], 'text', None))
        return "No response"
