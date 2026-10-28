const STORAGE_KEY = "todos";

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const emptyState = document.getElementById("empty-state");
const counter = document.getElementById("counter");

let todos = loadTodos();

function loadTodos() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveTodos() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // Storage unavailable (e.g. private mode): the list still works for this session.
  }
}

function addTodo(title) {
  todos.push({ id: Date.now(), title, done: false });
  saveTodos();
  render();
}

function toggleTodo(id) {
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.done = !todo.done;
    saveTodos();
    render();
  }
}

function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  saveTodos();
  render();
}

function render() {
  list.innerHTML = "";

  for (const todo of todos) {
    const item = document.createElement("li");
    item.className = "todo-item" + (todo.done ? " done" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;
    checkbox.setAttribute("aria-label", `Mark "${todo.title}" as done`);
    checkbox.addEventListener("change", () => toggleTodo(todo.id));

    const title = document.createElement("span");
    title.className = "title";
    title.textContent = todo.title;

    const del = document.createElement("button");
    del.className = "delete";
    del.textContent = "Delete";
    del.setAttribute("aria-label", `Delete "${todo.title}"`);
    del.addEventListener("click", () => deleteTodo(todo.id));

    item.append(checkbox, title, del);
    list.append(item);
  }

  const remaining = todos.filter((t) => !t.done).length;
  emptyState.hidden = todos.length > 0;
  counter.hidden = todos.length === 0;
  counter.textContent = `${remaining} of ${todos.length} task${todos.length === 1 ? "" : "s"} left`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = input.value.trim();
  if (title) {
    addTodo(title);
  }
  input.value = "";
  input.focus();
});

render();
