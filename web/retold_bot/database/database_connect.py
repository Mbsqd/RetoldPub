from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from files.config_data import config

engine = create_engine(
    url=config.DATABASE,
    echo=False,
    pool_size=5,
    max_overflow=10,
)

session_factory = sessionmaker(bind=engine)
