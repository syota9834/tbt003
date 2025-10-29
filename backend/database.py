from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# データベース接続URL (SQLiteの場合)
# "./sql_app.db" は、backendディレクトリ内に "sql_app.db" というファイルが作成されることを意味します
SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"

# SQLiteの場合、connect_args={"check_same_thread": False} が必要
# これは、SQLiteが単一スレッドでしか動作しないため、FastAPIの非同期処理と組み合わせるための設定
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# データベースセッションを作成するためのクラス
# autocommit=False: トランザクションを手動でコミットする
# autoflush=False: クエリ実行時に自動でフラッシュしない
# bind=engine: 作成したエンジンにバインドする
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# データベースモデルの基底クラス
# これを継承して、各テーブルのモデルを定義します
Base = declarative_base()

# FastAPIの依存性注入で使うための関数
# 各リクエストで独立したデータベースセッションを提供し、処理後に閉じる
def get_db():
    db = SessionLocal()
    try:
        yield db # セッションを呼び出し元に提供
    finally:
        db.close() # 処理が終わったらセッションを閉じる
