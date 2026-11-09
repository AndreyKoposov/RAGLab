from gigachat import GigaChat

from . import engine


class GigaChatEngine(engine.AIEngine):
    def __init__(self, key: str, model: str, temp: float) -> None:
        super().__init__(1)

        self.giga = GigaChat(
            credentials=key,
            model=model,
            verify_ssl_certs=False,
            temperature=temp,
            scope="GIGACHAT_API_PERS",
            timeout=30,
        )
        print(self.giga)

    def chat(self, query: str) -> str:
        response = self.giga.chat(query)
        # print(json.loads(response.choices[0].message.content))
        return response.choices[0].message.content
