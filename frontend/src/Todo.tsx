// Reactライブラリから、Reactの基本機能と「useState」（状態管理）、「useEffect」（副作用処理）フックをインポート
import React, { useState, useEffect } from 'react';

// Todoアイテムのデータ構造を定義するTypeScriptのインターフェース
interface TodoItem {
  id: number;        // Todoを一意に識別するID (数値)
  title: string;     // Todoの内容を示すテキスト (文字列)
  description: string;
  completed: boolean; // Todoが完了したかどうかを示すフラグ (真偽値)
}

const TodoItemTest = {
  title: "",
  description: ""
}

// FastAPIバックエンドのベースURL
// FastAPIアプリケーションが動作しているアドレスに合わせて変更してください
const API_BASE_URL = 'http://localhost:8000';

// Todoコンポーネント（Todoリストアプリケーションの本体）を定義する関数
function Todo() {
  // --- 状態管理 ---
  // useStateを使って、アプリケーションが持つべきデータ（状態）を定義する
  // Reactは、これらの状態が更新されると自動的に画面を再描画してくれる

  // [状態変数, 状態を更新するための関数] = useState(初期値);

  // Todoリストを管理するための状態。初期値は空の配列[]。型はTodoItem[]。
  const [todos, setTodos] = useState<TodoItem[]>([]);
  // テキスト入力欄の文字列を管理するための状態。初期値は空文字列''。
  const [inputTodos, setInputTodos] = useState(TodoItemTest);

  // --- 関数定義 ---

  /**
   * APIからTodoアイテムのリストを非同期で取得する関数
   */
  const fetchTodos = async () => {
    try {
      // FastAPIの /todos エンドポイントにGETリクエストを送信
      // 例: http://localhost:8000/todos
      const response = await fetch(`${API_BASE_URL}/todos`);
      // HTTPレスポンスが成功 (status 200-299) したかチェック
      if (!response.ok) {
        // 失敗した場合はエラーをスロー
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // レスポンスボディをJSON形式でパースし、TodoItem[]型として取得
      const data: TodoItem[] = await response.json();
      // 取得したTodoリストでtodosの状態を更新し、画面に反映
      setTodos(data);
    } catch (error) {
      // API呼び出し中にエラーが発生した場合、コンソールにエラーメッセージを表示
      console.error("Failed to fetch todos:", error);
    }
  };

  /**
   * コンポーネントがマウントされたとき（最初に画面に表示されたとき）に一度だけ実行される副作用フック
   * ここでは、初期のTodoリストをAPIからフェッチするために使用
   */
  useEffect(() => {
    fetchTodos();
  }, []); // 空の依存配列[]は、コンポーネントのマウント時とアンマウント時にのみ実行されることを意味する



  /**
   * input項目に入力したら状態を更新する
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
      setInputTodos(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  /**
   * 「Add」ボタンがクリックされたときに実行される関数
   * 新しいTodoアイテムをAPI経由で追加する
   */
  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();  // submitをさせない
    // 入力欄が空、または空白のみの場合は何もしない
    if (inputTodos.title.trim() === '') {
      return;
    }
    try {
      // FastAPIの /todos エンドポイントにPOSTリクエストを送信
      const response = await fetch(`${API_BASE_URL}/todos`, {
        method: 'POST', // HTTPメソッドをPOSTに指定（新しいリソースの作成）
        headers: {
          'Content-Type': 'application/json', // リクエストボディの形式がJSONであることを指定
        },
        // 送信するデータ（新しいTodoのタイトルと完了状態）をJSON文字列に変換してボディに含める
        body: JSON.stringify({
          title: inputTodos.title,
          description:inputTodos.description,
          completed: false
        }),
      });
      // HTTPレスポンスが成功したかチェック
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // バックエンドから返された、IDが付与された新しいTodoアイテムを取得
      const newTodo: TodoItem = await response.json();
      // 現在のTodoリストに新しいTodoを追加して状態を更新
      setTodos([...todos, newTodo]);
      // Todoを追加したら、入力欄を空にする
      setInputTodos(TodoItemTest);

    } catch (error) {
      // API呼び出し中にエラーが発生した場合、コンソールにエラーメッセージを表示
      console.error("Failed to add todo:", error);
    }
  };

  /**
   * 「Remove」ボタンがクリックされたときに実行される関数
   * 指定されたIDのTodoアイテムをAPI経由で削除する
   * @param id - 削除したいTodoのID
   */
  const removeTodo = async (id: number) => {
    try {
      // FastAPIの /todos/{id} エンドポイントにDELETEリクエストを送信
      // 例: http://localhost:8000/todos/1
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'DELETE', // HTTPメソッドをDELETEに指定（リソースの削除）
      });
      // HTTPレスポンスが成功したかチェック
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // 削除されたTodoを除外した新しいリストを作成し、todosの状態を更新
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      // API呼び出し中にエラーが発生した場合、コンソールにエラーメッセージを表示
      console.error("Failed to remove todo:", error);
    }
  };

  /**
   * Todoアイテムの完了状態を切り替える関数
   * @param id - 状態を切り替えたいTodoのID
   * @param completed - 新しい完了状態
   */
  const toggleTodoCompleted = async (id: number, completed: boolean) => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'PUT', // HTTPメソッドをPUTに指定（リソースの更新）
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: completed }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedTodo: TodoItem = await response.json();
      setTodos(todos.map(todo => (todo.id === id ? updatedTodo : todo)));
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  };

  // --- 画面表示 (JSX) ---
  // このコンポーネントが画面にどう表示されるかを定義する部分
  // HTMLに似たJSXという構文で記述する
  return (
    <div className="row">
      <div className="col-12">
        <div className="card mb-4">
          <div className="card-header">
            タスク入力
          </div>
          <div className="card-body">
            <form>
              <div className="input-group">
                <div className="col-4">
                  <input
                    type="text" name="title" className="form-control" value={inputTodos.title}
                    onChange={handleChange} placeholder="タスク名" />
                </div>
                <div className="col-4">
                  <input
                    type="text" className="form-control" name="description" value={inputTodos.description}
                    onChange={handleChange} placeholder="備考" />
                </div>
                <button type="submit" className="btn btn-primary" onClick={addTodo}>Add</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="col-6">
        <div className="card">
          <div className="card-header text-bg-success">
            タスク
          </div>
          <div className="card-body">
            <ul className="list-group">
              {todos.filter(todo => !todo.completed).map((todo) => (
                <li key={todo.id} className="list-group-item d-flex justify-content-between align-items-center">
                  {todo.title} - {todo.description}
                  <div className="float-right">
                    <button className="btn btn-primary btn-sm" onClick={() => toggleTodoCompleted(todo.id, !todo.completed)}>完了</button>
                     &nbsp;
                    <button className="btn btn-danger btn-sm" onClick={() => removeTodo(todo.id)}>削除</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="col-6">
        <div className="card">
          <div className="card-header text-bg-primary">
            完了
          </div>
          <div className="card-body">
            <ul className="list-group">
              {todos.filter(todo => todo.completed).map((todo) => (
                <li key={todo.id} className="list-group-item d-flex justify-content-between align-items-center">
                    {todo.title} - {todo.description}
                  <div className="float-right">
                    <button className="btn btn-success btn-sm" onClick={() => toggleTodoCompleted(todo.id, !todo.completed)}>戻す</button>
                    &nbsp;
                    <button className="btn btn-danger btn-sm" onClick={() => removeTodo(todo.id)}>削除</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}

// このTodoコンポーネントを、他のファイルからimportして使えるようにエクスポートする
export default Todo;
