// 環境変数インターフェース
export interface Env {
  DB: D1Database;
}

// リクエストボディの型定義
interface TodoRequestBody {
  title: string;
  description?: string | null;
  date?: string | null; // D1ではTEXTとして扱う
  completed?: boolean | null;
}

interface UserRequestBody {
  name?: string | null;
  DeleteFlg?: boolean | null;
}

interface TaskRequestBody {
  name?: string | null;
  startDate?: string | null; // D1ではTEXTとして扱う
  endDate?: string | null;   // D1ではTEXTとして扱う
  UserId: number;
  assigneeId: number;
  DeleteFlg?: boolean | null;
  completed?: boolean | null;
}

// CORSヘッダー
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // 本番環境では特定のオリジンに制限することを推奨
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const method = request.method;

    console.log('Request Pathname:', pathname); // パス名をログに出力

    if (!env.DB) {
      console.error('D1 Database binding (env.DB) is not available.');
      return new Response(JSON.stringify({ error: 'D1 Database binding not available.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // OPTIONSリクエストのハンドリング (CORSプリフライト)
    if (method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    try {
      // ルートパス
      if (pathname === '/') {
        return new Response(JSON.stringify({ message: 'Welcome to tbt003-api Worker!' }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      // --- Todo エンドポイント ---
      if (pathname === '/todos' || pathname === '/todos/') {
        if (method === 'POST') {
          const { title, description, date, completed } = await request.json() as TodoRequestBody;
          const { success } = await env.DB.prepare(
            'INSERT INTO todos (title, description, date, completed) VALUES (?, ?, ?, ?)'
          ).bind(title, description || null, date || null, completed ? 1 : 0).run();

          if (success) {
            return new Response(JSON.stringify({ message: 'Todo created' }), {
              status: 201,
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            });
          }
          return new Response(JSON.stringify({ error: 'Failed to create todo' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        } else if (method === 'GET') {
          const { results } = await env.DB.prepare('SELECT * FROM todos').all();
          return new Response(JSON.stringify(results), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        }
      } else if (pathname.startsWith('/todos/')) {
        const id = pathname.split('/').pop(); // IDを抽出
        if (!id || isNaN(Number(id))) {
          return new Response(JSON.stringify({ error: 'Invalid Todo ID' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        }

        if (method === 'GET') {
          const { results } = await env.DB.prepare('SELECT * FROM todos WHERE id = ?').bind(id).all();
          if (results.length > 0) {
            return new Response(JSON.stringify(results[0]), {
              status: 200,
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            });
          }
          return new Response(JSON.stringify({ error: 'Todo not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        } else if (method === 'PUT') {
          const { title, description, date, completed } = await request.json() as TodoRequestBody;
          const { success } = await env.DB.prepare(
            'UPDATE todos SET title = ?, description = ?, date = ?, completed = ? WHERE id = ?'
          ).bind(title, description || null, date || null, completed ? 1 : 0, id).run();

          if (success) {
            return new Response(JSON.stringify({ message: 'Todo updated' }), {
              status: 200,
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            });
          }
          return new Response(JSON.stringify({ error: 'Failed to update todo' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        } else if (method === 'DELETE') {
          const { success } = await env.DB.prepare('DELETE FROM todos WHERE id = ?').bind(id).run();

          if (success) {
            return new Response(JSON.stringify({ message: 'Todo deleted' }), {
              status: 200,
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            });
          }
          return new Response(JSON.stringify({ error: 'Failed to delete todo' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        }
      }

      // --- UserTBL エンドポイント ---
      if (pathname.includes('/user')) {
        if (method === 'POST') {
          const { name, DeleteFlg } = await request.json() as UserRequestBody;
          const { success } = await env.DB.prepare(
            'INSERT INTO UserTBL (name, DeleteFlg, LastModified) VALUES (?, ?, ?)'
          ).bind(name || null, DeleteFlg ? 1 : 0, new Date().toISOString()).run();

          if (success) {
            return new Response(JSON.stringify({ message: 'User created' }), {
              status: 201,
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            });
          }
          return new Response(JSON.stringify({ error: 'Failed to create user' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        }
        if (method === 'GET') {
          const { results } = await env.DB.prepare('SELECT * FROM UserTBL').all();
          if (results.length > 0) {
            return new Response(JSON.stringify(results), {
              status: 200,
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            });
          }
          return new Response(JSON.stringify({ error: 'User not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        }
        const id = pathname.split('/').pop(); // IDを抽出
        if (!id || isNaN(Number(id))) {
          return new Response(JSON.stringify({ error: 'Invalid User ID' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        }
        
        if (method === 'PUT') {
          const { name, DeleteFlg } = await request.json() as UserRequestBody;
          const { success } = await env.DB.prepare(
            'UPDATE UserTBL SET name = ?, DeleteFlg = ?, LastModified = ? WHERE id = ?'
          ).bind(name || null, DeleteFlg ? 1 : 0, new Date().toISOString(), id).run();

          if (success) {
            return new Response(JSON.stringify({ message: 'User updated' }), {
              status: 200,
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            });
          }
          return new Response(JSON.stringify({ error: 'Failed to update user' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        } else if (method === 'DELETE') {
          const { success } = await env.DB.prepare('DELETE FROM UserTBL WHERE id = ?').bind(id).run();

          if (success) {
            return new Response(JSON.stringify({ message: 'User deleted' }), {
              status: 200,
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            });
          }
          return new Response(JSON.stringify({ error: 'Failed to delete user' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        }
      }

      // --- TaskTBL エンドポイント ---
      if (pathname === '/task') {
        if (method === 'POST') {
          const { name, startDate, endDate, UserId, assigneeId, DeleteFlg, completed } = await request.json() as TaskRequestBody;
          const { success } = await env.DB.prepare(
            'INSERT INTO TaskTBL (name, startDate, endDate, UserId, assigneeId, DeleteFlg, completed, LastModified) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
          ).bind(
            name || null,
            startDate || null,
            endDate || null,
            UserId,
            assigneeId,
            DeleteFlg ? 1 : 0,
            completed ? 1 : 0,
            new Date().toISOString()
          ).run();

          if (success) {
            return new Response(JSON.stringify({ message: 'Task created' }), {
              status: 201,
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            });
          }
          return new Response(JSON.stringify({ error: 'Failed to create task' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        } else if (method === 'GET') {
          const { results } = await env.DB.prepare('SELECT * FROM TaskTBL').all();
          return new Response(JSON.stringify(results), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        }
      } else if (pathname.includes('/task/update')) {
        const id = pathname.split('/').pop(); // IDを抽出
        if (!id || isNaN(Number(id))) {
          return new Response(JSON.stringify({ error: 'Invalid Task ID' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        }
        if (method === 'GET') {
          const { results } = await env.DB.prepare('SELECT * FROM TaskTBL WHERE id = ?').bind(id).all();
          if (results.length > 0) {
            return new Response(JSON.stringify(results[0]), {
              status: 200,
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            });
          }
          return new Response(JSON.stringify({ error: 'Task not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        } else if (method === 'PUT') {
          const { name, startDate, endDate, UserId, assigneeId, DeleteFlg, completed } = await request.json() as TaskRequestBody;
          const { success } = await env.DB.prepare(
            'UPDATE TaskTBL SET name = ?, startDate = ?, endDate = ?, UserId = ?, assigneeId = ?, DeleteFlg = ?, completed = ?, LastModified = ? WHERE id = ?'
          ).bind(
            name || null,
            startDate || null,
            endDate || null,
            UserId,
            assigneeId,
            DeleteFlg ? 1 : 0,
            completed ? 1 : 0,
            new Date().toISOString(),
            id
          ).run();

          if (success) {
            // 更新されたタスクを再度取得して返す
            const { results } = await env.DB.prepare('SELECT * FROM TaskTBL WHERE id = ?').bind(id).all();
            if (results.length > 0) {
              return new Response(JSON.stringify(results[0]), {
                status: 200,
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
              });
            }
            return new Response(JSON.stringify({ error: 'Updated task not found' }), {
              status: 404,
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            });
          }
          return new Response(JSON.stringify({ error: 'Failed to update task' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        } else if (method === 'DELETE') {
          const { success } = await env.DB.prepare('DELETE FROM TaskTBL WHERE id = ?').bind(id).run();

          if (success) {
            // 更新されたタスクを再度取得して返す
            const { results } = await env.DB.prepare('SELECT * FROM TaskTBL WHERE id = ?').bind(id).all();
            if (results.length > 0) {
              return new Response(JSON.stringify(results[0]), {
                status: 200,
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
              });
            }
            return new Response(JSON.stringify({ message: 'Task deleted' }), {
              status: 200,
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            });
          }
          return new Response(JSON.stringify({ error: 'Failed to delete task' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        }
      }

      // 未定義のルートのハンドリング
      return new Response(JSON.stringify({ error: 'Not Found.' }), { status: 404, headers: corsHeaders });

    } catch (error) {
      console.error('Error during request handling:', error);
      return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'An unknown error occurred during request handling' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
  },
} satisfies ExportedHandler<Env>;
