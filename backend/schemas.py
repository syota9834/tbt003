from pydantic import BaseModel
from typing import Union
from datetime import datetime

# Todoのベーススキーマ（作成・更新時に共通で使うフィールド）
class TodoBase(BaseModel):
    title: str
    description: Union[str, None] = None # descriptionはオプショナル

# Todo作成時のリクエストボディのスキーマ
class TodoCreate(TodoBase):
    pass # TodoBaseのフィールドをそのまま使う

# Todo更新時のリクエストボディのスキーマ
class TodoUpdate(TodoBase):
    # 更新時は全てのフィールドをオプショナルにする
    title: Union[str, None] = None
    description: Union[str, None] = None
    date: Union[date, None] = None
    completed: Union[bool, None] = None

# APIが返すTodoアイテムのレスポンススキーマ
class Todo(TodoBase):
    id: int
    completed: bool = False # completedフィールドを追加

    # PydanticがSQLAlchemyモデルからデータを読み込むための設定
    class Config:
        from_attributes = True # from_attributes = True に変更
