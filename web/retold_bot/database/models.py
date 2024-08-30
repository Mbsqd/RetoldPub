import datetime
from typing import Annotated
from uuid import UUID
from sqlalchemy import MetaData, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, DeclarativeBase

intpk = Annotated[int, mapped_column(primary_key=True)]


class Base(DeclarativeBase):
    pass


class UsersOrm(Base):
    __tablename__ = 'Users'

    Id: Mapped[intpk]
    Username: Mapped[str]
    Email: Mapped[str]
    HashedPassword: Mapped[str]
    TelegramCode: Mapped[UUID]


class BlocksOrm(Base):
    __tablename__ = 'Blocks'

    Id: Mapped[intpk]
    UserId: Mapped[int] = mapped_column(ForeignKey("Users.Id", ondelete="CASCADE"))
    Title: Mapped[str]
    Description: Mapped[str]
    ChatsId: Mapped[str]


class SchedulesOrm(Base):
    __tablename__ = 'Schedules'

    Id: Mapped[intpk]
    BlockId: Mapped[int] = mapped_column(ForeignKey("Blocks.Id", ondelete="CASCADE"))
    TypeWeek: Mapped[int]
    Day: Mapped[int]
    TimeStart: Mapped[datetime.time]
    TimeEnd: Mapped[datetime.time]
    Title: Mapped[str]
    LessonType: Mapped[str]
    Cabinet: Mapped[str]
    LinkFirst: Mapped[str]
    LinkSecond: Mapped[str]


class ConsultationsOrm(Base):
    __tablename__ = 'Consultations'

    Id: Mapped[intpk]
    BlockId: Mapped[int] = mapped_column(ForeignKey("Blocks.Id", ondelete="CASCADE"))
    Title: Mapped[str]
    TeacherName: Mapped[str]
    Day: Mapped[int]
    TimeStart: Mapped[datetime.time]
    Cabinet: Mapped[str]
    Link: Mapped[str]
