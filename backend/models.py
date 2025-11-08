from sqlalchemy import Boolean, Column, Integer, String, Date, DateTime, func, ForeignKey
from sqlalchemy.orm import relationship
from database import Base # database.pyで定義したBaseをインポート

# Todoアイテムのデータベースモデル
class Todo(Base):
    __tablename__ = "todos" # テーブル名を "todos" とする

    id = Column(Integer, primary_key=True, index=True) # 主キー、自動インクリメント、インデックス付き
    title = Column(String, index=True) # Todoのタイトル、インデックス付き
    description = Column(String, default="") # Todoの詳細、デフォルトは空文字列
    date = Column(Date, default=None)
    completed = Column(Boolean, default=False) # 完了状態、デフォルトはFalse


class UserTBL(Base):
    __tablename__ = "UserTBL"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, default="")
    tasks = relationship("TaskTBL", backref="parent")
    DeleteFlg = Column(Boolean, default=False)
    LastModified = Column(DateTime, onupdate=func.now())


class TaskTBL(Base):
    __tablename__ = "TaskTBL"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, default="")
    startDate = Column(DateTime, default=None)
    endDate = Column(DateTime, default=None)
    assigneeId = Column(Integer, ForeignKey("UserTBL.id"))
    DeleteFlg = Column(Boolean, default=False)
    LastModified = Column(DateTime, onupdate=func.now())
