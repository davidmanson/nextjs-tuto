'use client';

import { useState, useEffect } from 'react';

type Filter = 'all' | 'active' | 'completed';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  function addTodo(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setTodos([
      { id: crypto.randomUUID(), text, completed: false, createdAt: Date.now() },
      ...todos,
    ]);
    setInput('');
  }

  function toggleTodo(id: string) {
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }

  function deleteTodo(id: string) {
    setTodos(todos.filter((t) => t.id !== id));
  }

  function clearCompleted() {
    setTodos(todos.filter((t) => !t.completed));
  }

  const filtered = todos.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="min-h-screen flex flex-col items-center py-16 px-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <h1 className="text-5xl font-bold text-center text-indigo-700 mb-10 tracking-tight">
          Mes Tâches
        </h1>

        {/* Form */}
        <form onSubmit={addTodo} className="flex gap-3 mb-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ajouter une nouvelle tâche..."
            className="flex-1 px-4 py-3 rounded-xl border-2 border-indigo-200 focus:outline-none focus:border-indigo-500 bg-white text-gray-700 placeholder-gray-400 shadow-sm transition"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 active:scale-95 transition shadow-sm"
          >
            Ajouter
          </button>
        </form>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-4">
          {(['all', 'active', 'completed'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                filter === f
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-white text-gray-500 hover:bg-indigo-50 border border-gray-200'
              }`}
            >
              {f === 'all' ? 'Toutes' : f === 'active' ? 'En cours' : 'Terminées'}
            </button>
          ))}
        </div>

        {/* Todo list */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-400 py-12 text-sm">
              {filter === 'completed'
                ? 'Aucune tâche terminée.'
                : filter === 'active'
                ? 'Aucune tâche en cours.'
                : 'Ajoutez votre première tâche !'}
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {filtered.map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-center gap-4 px-5 py-4 group hover:bg-indigo-50 transition"
                >
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    aria-label={todo.completed ? 'Marquer comme non terminé' : 'Marquer comme terminé'}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition ${
                      todo.completed
                        ? 'bg-indigo-500 border-indigo-500'
                        : 'border-gray-300 hover:border-indigo-400'
                    }`}
                  >
                    {todo.completed && (
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <span
                    className={`flex-1 text-base transition ${
                      todo.completed ? 'line-through text-gray-400' : 'text-gray-700'
                    }`}
                  >
                    {todo.text}
                  </span>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    aria-label="Supprimer"
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition ml-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {todos.length > 0 && (
          <div className="flex justify-between items-center mt-4 px-1 text-sm text-gray-500">
            <span>
              {activeCount} tâche{activeCount !== 1 ? 's' : ''} restante{activeCount !== 1 ? 's' : ''}
            </span>
            {completedCount > 0 && (
              <button
                onClick={clearCompleted}
                className="text-red-400 hover:text-red-600 transition"
              >
                Effacer les terminées ({completedCount})
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
