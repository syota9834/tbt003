from fastapi import FastAPI, Depends, HTTPException, status, Query, Path
from sqlalchemy.orm import Session
from sqlalchemy import func, and_ # and_をインポート
from typing import List, Union
import models, schemas
from database import SessionLocal, engine, get_db
from datetime import datetime
# --- CORS設定 ---
# フロントエンド（例: http://localhost:5173）からのリクエストを許可するために必要
from fastapi.middleware.cors import CORSMiddleware


# データベーステーブルを初期化（存在しない場合のみ作成）
models.Base.metadata.create_all(bind=engine)

# FastAPIのインスタンスを作成
app = FastAPI(
    title="My Super Project API",
    description="これはReactアプリと連携するための、ものすごくクールなAPIです。",
    version="1.0.0",
)



origins = [
    "http://localhost",
    "http://localhost:5173", # React開発サーバーのURL
    "http://localhost:5174", # React開発サーバーのURL (ポートが5174の場合)
    "*" # 開発用にすべてのオリジンを許可 (本番環境では具体的なオリジンを指定すること)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # 全てのHTTPメソッドを許可
    allow_headers=["*"], # 全てのヘッダーを許可
)

# --- エンドポイントを定義 ---

@app.get(
    "/",
    tags=["Default"],
    summary="ルートエンドポイント",
)
def read_root():
    """
    APIのルートパス。
    - **Hello**: Worldを返します。
    """
    return {"Hello": "World"}

# --- Todo関連のエンドポイント ---

@app.post(
    "/todos/",
    response_model=schemas.Todo, # レスポンスのスキーマを指定
    tags=["Todos"],
    summary="新しいTodoを作成",
    status_code=status.HTTP_201_CREATED, # 作成成功時は201を返す
)
def create_todo(todo: schemas.TodoCreate, db: Session = Depends(get_db)):
    """
    新しいTodoアイテムを作成します。

    - **todo**: 作成するTodoのタイトルと説明。
    """
    db_todo = models.Todo(
        title=todo.title,
        description=todo.description,
        date=datetime.today(),
        )
    db.add(db_todo) # データベースに追加
    db.commit() # 変更をコミット
    db.refresh(db_todo) # データベースから最新の情報を取得（idなどが設定される）
    return db_todo

@app.get(
    "/todos/",
    response_model=List[schemas.Todo], # Todoのリストを返す
    tags=["Todos"],
    summary="今日のTodoを取得",
)
def read_todos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    全てのTodoアイテムを取得します。

    - **skip**: 取得を開始するオフセット。
    - **limit**: 取得するTodoの最大数。
    """
    target_date = datetime.today().date()
    todos = db.query(models.Todo).filter(models.Todo.date == target_date).offset(skip).limit(limit).all()

    return todos

@app.get(
    "/todos/{todo_id}",
    response_model=schemas.Todo,
    tags=["Todos"],
    summary="特定のTodoを取得",
)
def read_todo(todo_id: int, db: Session = Depends(get_db)):
    """
    指定されたIDのTodoアイテムを取得します。

    - **todo_id**: 取得したいTodoのID。
    """
    todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo


@app.get(
    "/logs/",
    tags=["Logs"],
    summary="過去のTodoを取得",
)
def log_todo(db: Session = Depends(get_db)):
    target_date = datetime.today().date()
    logs = db.query(models.Todo).filter(models.Todo.date != target_date).all()
    return logs


@app.put(
    "/todos/{todo_id}",
    response_model=schemas.Todo,
    tags=["Todos"],
    summary="Todoを更新",
)
def update_todo(todo_id: int, todo_update: schemas.TodoUpdate, db: Session = Depends(get_db)):
    """
    指定されたIDのTodoアイテムを更新します。

    - **todo_id**: 更新したいTodoのID。
    - **todo_update**: 更新するTodoのタイトル、説明、完了状態。
    """
    db_todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")

    # Pydanticモデルのdict()メソッドを使って、更新対象のフィールドのみを適用
    update_data = todo_update.model_dump(exclude_unset=True) # exclude_unset=True でNoneでないフィールドのみ更新
    for key, value in update_data.items():
        setattr(db_todo, key, value)

    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

@app.delete(
    "/todos/{todo_id}",
    tags=["Todos"],
    summary="Todoを削除",
    status_code=status.HTTP_204_NO_CONTENT, # 削除成功時は204を返す
)
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    """
    指定されたIDのTodoアイテムを削除します。

    - **todo_id**: 削除したいTodoのID。
    """
    db_todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")

    db.delete(db_todo)
    db.commit()
    return {"message": "Todo deleted successfully"} # 204 No Content のため、実際にはボディは返されない

@app.get(
    "/user",
    tags=["User"],
    summary="ユーザーの一覧を取得",
)
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    全てのUserを取得します。

    - **skip**: 取得を開始するオフセット。
    - **limit**: 取得するTodoの最大数。
    """
    todos = db.query(models.UserTBL).offset(skip).limit(limit).all()

    return todos

@app.post(
    "/user",
    response_model=schemas.User,
    tags=["User"],
    summary="ユーザーを新規作成",
    status_code=status.HTTP_201_CREATED,
)
def create_users(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = models.UserTBL(
        name = user.name,
        LastModified = datetime.today(),
        DeleteFlg = False
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.put(
    "/user/{user_id}",
    response_model=schemas.User,
    tags=["User"],
    summary="ユーザーを削除",
)
def update_users(user_id: int, user: schemas.UserUpdate, db: Session = Depends(get_db)):
    db_user = db.query(models.UserTBL).filter(models.UserTBL.id == user_id).first()
    update_data = user.model_dump(exclude_unset=True) # exclude_unset=True でNoneでないフィールドのみ更新

    for key, value in update_data.items():
        setattr(db_user, key, value)

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get(
    "/task",
    tags=["Task"],
    summary="タスクの一覧を取得",
)
def read_tasks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    全てのTaskを取得します。

    - **skip**: 取得を開始するオフセット。
    - **limit**: 取得するTodoの最大数。
    """
    tasks = db.query(models.TaskTBL).join(models.UserTBL).filter(
        models.TaskTBL.DeleteFlg == False,
        models.UserTBL.DeleteFlg == False
    ).offset(skip).limit(limit).all()

    return tasks

@app.post(
    "/task",
    response_model=schemas.Task, # レスポンスのスキーマを指定
    tags=["Task"],
    summary="タスクを新規作成",
    status_code=status.HTTP_201_CREATED,
)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    db_task = models.TaskTBL(
        name = task.name,
        startDate = task.startDate,
        endDate = task.endDate,
        assigneeId = task.assigneeId,
        UserId = task.assigneeId,
        DeleteFlg = task.DeleteFlg
    )
    db.add(db_task)  # データベースに追加
    db.commit()  # 変更をコミット
    db.refresh(db_task)  # データベースから最新の情報を取得（idなどが設定される）
    return db_task

@app.put(
    "/task/update/{task_id}",
    response_model=schemas.Task,
    tags=["Task"],
    summary="タスクを更新",
    status_code=status.HTTP_201_CREATED,
)
def update_task(task_id: int, task: schemas.TaskUpdate, db: Session = Depends(get_db)):
    db_task = db.query(models.TaskTBL).filter(models.TaskTBL.id == task_id).first()
    if db_task is None:
        raise HTTPException(status_code=404, detail="Todo not found")

    # Pydanticモデルのdict()メソッドを使って、更新対象のフィールドのみを適用
    update_data = task.model_dump(exclude_unset=True)  # exclude_unset=True でNoneでないフィールドのみ更新
    for key, value in update_data.items():
        setattr(db_task, key, value)

    db.add(db_task)
    db.commit()
    db.refresh(db_task)

    return db_task

@app.delete(
    "/task/update/{task_id}",
    tags=["Task"],
    summary="タスクを削除",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    db_todo = db.query(models.TaskTBL).filter(models.TaskTBL.id == task_id).first()
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")

    db.delete(db_todo)
    db.commit()
    return {"message": "Todo deleted successfully"}


@app.get(
    "/metrics/completed_task_time_by_user",
    tags=["Metrics"],
    summary="ユーザーごとの完了タスク合計時間を取得",
)
def get_completed_task_time_by_user(db: Session = Depends(get_db)):
    """
    各ユーザーが完了したタスクの合計時間を取得します。
    結果はユーザー名と合計時間（分単位）のリストとして返されます。
    """

    duration_minutes = (
        func.strftime('%s', models.TaskTBL.endDate) -
        func.strftime('%s', models.TaskTBL.startDate)
    ) / 60

    results = db.query(
        models.UserTBL.name,
        func.coalesce(func.sum(duration_minutes), 0)
    ).outerjoin(
        models.TaskTBL,
        and_(
            models.UserTBL.id == models.TaskTBL.UserId,
            models.TaskTBL.completed == True,
            models.TaskTBL.DeleteFlg == False,
        )
    ).filter(
        models.UserTBL.name.like('\_%', escape='\\'),
        models.UserTBL.DeleteFlg == False
    ).group_by(models.UserTBL.name).all()

    # 結果を辞書のリストに変換
    formatted_results = []
    for name, total_minutes in results:
        formatted_results.append({
            "name": name,
            "completedTime": round(total_minutes) if total_minutes else 0
        })
    return formatted_results
