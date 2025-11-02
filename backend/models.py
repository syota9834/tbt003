from sqlalchemy import Boolean, Column, Integer, String, Date
from database import Base # database.pyで定義したBaseをインポート

# Todoアイテムのデータベースモデル
class Todo(Base):
    __tablename__ = "todos" # テーブル名を "todos" とする

    id = Column(Integer, primary_key=True, index=True) # 主キー、自動インクリメント、インデックス付き
    title = Column(String, index=True) # Todoのタイトル、インデックス付き
    description = Column(String, default="") # Todoの詳細、デフォルトは空文字列
    date = Column(Date, default=None)
    completed = Column(Boolean, default=False) # 完了状態、デフォルトはFalse
