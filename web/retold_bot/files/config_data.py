from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    bot_token: str
    alerts_token: str
    host: str
    port: int
    user: str
    password: str
    database: str

    @property
    def DATABASE(self):
        return f"postgresql+psycopg://{self.user}:{self.password}@{self.host}:{self.port}/{self.database}"

    model_config = SettingsConfigDict(env_file="files/.env", env_file_encoding='utf-8')


config = Settings()
