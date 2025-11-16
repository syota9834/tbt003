-- todos テーブル
CREATE TABLE todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    date TEXT, -- SQLiteのDate型はTEXTで保存されることが多い
    completed INTEGER DEFAULT 0 -- BooleanはINTEGER (0: False, 1: True)
);

-- UserTBL テーブル
CREATE TABLE UserTBL (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    DeleteFlg INTEGER DEFAULT 0,
    LastModified TEXT -- DateTime型もTEXTで保存されることが多い
);

-- TaskTBL テーブル
CREATE TABLE TaskTBL (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    startDate TEXT,
    endDate TEXT,
    UserId INTEGER,
    assigneeId INTEGER,
    DeleteFlg INTEGER DEFAULT 0,
    completed INTEGER DEFAULT 0,
    LastModified TEXT,
    FOREIGN KEY (UserId) REFERENCES UserTBL(id)
);
