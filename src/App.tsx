import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('zen-todos');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((t: Todo) => ({ ...t, createdAt: new Date(t.createdAt) }));
    }
    return [];
  });
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    localStorage.setItem('zen-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!inputValue.trim()) return;
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      completed: false,
      createdAt: new Date(),
    };
    setTodos([newTodo, ...todos]);
    setInputValue('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(t => !t.completed));
  };

  const filteredTodos = todos.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const activeTodos = todos.filter(t => !t.completed).length;
  const completedTodos = todos.filter(t => t.completed).length;

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 opacity-[0.03]">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="80" fill="none" stroke="#C41E3A" strokeWidth="0.5"/>
          <circle cx="100" cy="100" r="60" fill="none" stroke="#C41E3A" strokeWidth="0.5"/>
          <circle cx="100" cy="100" r="40" fill="none" stroke="#C41E3A" strokeWidth="0.5"/>
        </svg>
      </div>

      <div className="absolute bottom-20 left-0 w-32 h-32 md:w-48 md:h-48 opacity-[0.04]">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="10" y="10" width="80" height="80" fill="none" stroke="#1A1A1A" strokeWidth="0.5"/>
          <rect x="20" y="20" width="60" height="60" fill="none" stroke="#1A1A1A" strokeWidth="0.5"/>
        </svg>
      </div>

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 md:px-8 py-8 md:py-16">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 md:mb-16"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-[#8B8680] text-xs md:text-sm tracking-[0.3em] uppercase font-karla mb-2"
              >
                {dateStr}
              </motion.p>
              <h1 className="font-playfair text-4xl md:text-6xl text-[#1A1A1A] tracking-tight">
                Tasks
              </h1>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-4 md:gap-6 text-xs md:text-sm font-karla"
            >
              <span className="text-[#8B8680]">
                <span className="text-[#C41E3A] font-medium">{activeTodos}</span> pending
              </span>
              <span className="w-px h-4 bg-[#E5E2DE]" />
              <span className="text-[#8B8680]">
                <span className="text-[#1A1A1A] font-medium">{completedTodos}</span> done
              </span>
            </motion.div>
          </div>
        </motion.header>

        {/* Input Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-8 md:mb-12"
        >
          <div className="relative group">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTodo()}
              placeholder="What needs to be done?"
              className="w-full bg-transparent border-b-2 border-[#E5E2DE] focus:border-[#C41E3A]
                         py-4 md:py-5 text-base md:text-lg font-karla text-[#1A1A1A] placeholder:text-[#C4C0B9]
                         outline-none transition-colors duration-300"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addTodo}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12
                         bg-[#C41E3A] text-white rounded-full flex items-center justify-center
                         opacity-0 group-focus-within:opacity-100 transition-opacity duration-300
                         hover:bg-[#A31830]"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </motion.button>
          </div>
        </motion.section>

        {/* Filter Tabs */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex gap-1 md:gap-2 mb-6 md:mb-8 overflow-x-auto pb-2"
        >
          {(['all', 'active', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 md:px-6 py-2 md:py-2.5 text-xs md:text-sm font-karla tracking-wide uppercase transition-all duration-300 whitespace-nowrap
                ${filter === f
                  ? 'bg-[#1A1A1A] text-white'
                  : 'bg-transparent text-[#8B8680] hover:text-[#1A1A1A] hover:bg-[#F0EDE8]'
                } rounded-full`}
            >
              {f}
            </button>
          ))}
          {completedTodos > 0 && (
            <button
              onClick={clearCompleted}
              className="ml-auto px-4 md:px-6 py-2 md:py-2.5 text-xs md:text-sm font-karla tracking-wide uppercase
                         text-[#C41E3A] hover:bg-[#FDF2F4] rounded-full transition-colors duration-300 whitespace-nowrap"
            >
              Clear done
            </button>
          )}
        </motion.section>

        {/* Todo List */}
        <section className="space-y-2 md:space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredTodos.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 md:py-20 text-center"
              >
                <div className="inline-block mb-4 md:mb-6 opacity-20">
                  <svg className="w-12 h-12 md:w-16 md:h-16" viewBox="0 0 64 64" fill="none">
                    <circle cx="32" cy="32" r="24" stroke="#1A1A1A" strokeWidth="1"/>
                    <path d="M24 32l6 6 12-12" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="text-[#8B8680] font-karla text-sm md:text-base">
                  {filter === 'completed'
                    ? 'No completed tasks yet'
                    : filter === 'active'
                      ? 'All tasks completed!'
                      : 'Begin your journey'}
                </p>
              </motion.div>
            )}

            {filteredTodos.map((todo, index) => (
              <motion.div
                key={todo.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1]
                }}
                className={`group relative bg-white rounded-lg md:rounded-xl p-4 md:p-6
                           border border-[#F0EDE8] hover:border-[#E5E2DE]
                           transition-all duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)]
                           ${todo.completed ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start gap-3 md:gap-4">
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`flex-shrink-0 w-6 h-6 md:w-7 md:h-7 mt-0.5 rounded-full border-2 transition-all duration-300
                      flex items-center justify-center
                      ${todo.completed
                        ? 'border-[#C41E3A] bg-[#C41E3A]'
                        : 'border-[#D4D0C8] hover:border-[#C41E3A]'}`}
                  >
                    {todo.completed && (
                      <motion.svg
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-3 h-3 md:w-4 md:h-4 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      </motion.svg>
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className={`font-karla text-base md:text-lg text-[#1A1A1A] transition-all duration-500 break-words
                      ${todo.completed ? 'line-through text-[#B8B3AB]' : ''}`}>
                      {todo.text}
                    </p>
                    <p className="text-[10px] md:text-xs text-[#C4C0B9] mt-1 font-karla">
                      {todo.createdAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </p>
                  </div>

                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100
                               w-8 h-8 md:w-10 md:h-10 flex items-center justify-center
                               text-[#C4C0B9] hover:text-[#C41E3A] transition-all duration-300"
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none">
                      <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>

                {/* Decorative accent line */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg md:rounded-l-xl transition-all duration-300
                  ${todo.completed ? 'bg-[#E5E2DE]' : 'bg-[#C41E3A] opacity-0 group-hover:opacity-100'}`}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 md:py-8 text-center">
        <p className="text-[#B8B3AB] text-[10px] md:text-xs font-karla tracking-wide">
          Requested by @web-user · Built by @clonkbot
        </p>
      </footer>
    </div>
  );
}

export default App;
