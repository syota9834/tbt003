// Reactライブラリから、Reactの基本機能と「useState」というフック（状態管理機能）をインポート
import React, { useState } from 'react';

// Appコンポーネント（アプリケーションの本体）を定義する関数
function Todo() {
  // --- 状態管理 ---
  // useStateを使って、アプリケーションが持つべきデータ（状態）を定義する
  // Reactは、これらの状態が更新されると自動的に画面を再描画してくれる

  // [状態変数, 状態を更新するための関数] = useState(初期値);

  // Todoリストを管理するための状態。初期値は空の配列[]。
  const [todos, setTodos] = useState<string[]>([]);
  // テキスト入力欄の文字列を管理するための状態。初期値は空文字列''。
  const [input, setInput] = useState('');

  // --- 関数定義 ---

  /**
   * 「Add」ボタンがクリックされたときに実行される関数
   */
  const addTodo = () => {
    // 入力欄が空、または空白のみの場合は何もしない
    if (input.trim() === '') {
      return;
    }
    // 現在のTodoリスト(...todos)に、入力された新しいTodo(input)を追加して、状態を更新
    setTodos([...todos, input]);
    // Todoを追加したら、入力欄を空にする
    setInput('');
  };

  /**
   * 「Remove」ボタンがクリックされたときに実行される関数
   * @param index - 削除したいTodoのインデックス番号
   */
  const removeTodo = (index: number) => {
    // filterメソッドを使って、指定されたindex以外の要素で新しい配列を作成する
    const newTodos = todos.filter((_, i) => i !== index);
    // 作成した新しい配列でTodoリストの状態を更新する
    setTodos(newTodos);
  };

  // --- 画面表示 (JSX) ---
  // このコンポーネントが画面にどう表示されるかを定義する部分
  // HTMLに似たJSXという構文で記述する
  return (
    <div className="row justify-content-center">
      <div className="col">
        <div className="card mb-4">
          <div className="card-header">
            タスク入力
          </div>
          <div className="card-body">
            <div className="input-group mb-3">
              {/* テキスト入力欄 */}
              <input
                type="text"
                className="form-control"
                value={input} // 表示する値はinput状態変数を指定
                // 文字が入力されるたびにsetInputが呼ばれ、input状態が更新される
                onChange={(e) => setInput(e.target.value)}
                placeholder="Add a new todo"
              />
              {/* 追加ボタン。クリックされるとaddTodo関数が実行される */}
              <button className="btn btn-primary" onClick={addTodo}>Add</button>
            </div>
          </div>
          </div>
          <div className="card">
            <div className="card-header">
              履歴
            </div>
            <div className="card-body">
            {/* Todoリスト */}
            <ul className="list-group">
              {/* todos配列の中身を一つずつ取り出して<li>要素を生成する */}
              {todos.map((todo, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                  {/* Todoのテキスト */}
                  {todo}
                  {/* 削除ボタン。クリックされると、そのTodoのindexを渡してremoveTodo関数が実行される */}
                  <button className="btn btn-danger btn-sm" onClick={() => removeTodo(index)}>Remove</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// このAppコンポーネントを、他のファイルからimportして使えるようにエクスポートする
export default Todo;
