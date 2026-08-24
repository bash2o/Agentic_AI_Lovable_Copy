// script.js - Task Manager Application
// Implements data model, storage, state management, UI rendering, and CRUD operations.

(() => {
  // ---------- 1. Data Model ----------
  class Task {
    constructor(id, title, description, priority, dueDate, completed = false) {
      this.id = id;
      this.title = title;
      this.description = description;
      this.priority = priority; // Expected values: "Low", "Medium", "High"
      this.dueDate = dueDate; // ISO string (yyyy-mm-dd) or empty string
      this.completed = completed;
    }
    toJSON() {
      // Return plain object for storage (JSON.stringify will call this)
      return {
        id: this.id,
        title: this.title,
        description: this.description,
        priority: this.priority,
        dueDate: this.dueDate,
        completed: this.completed,
      };
    }
  }

  // Export via IIFE pattern (exposed on window for potential external use)
  window.Task = Task;

  // ---------- 2. Storage Layer ----------
  const STORAGE_KEY = "studentTaskManager";

  function loadTasks() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      const arr = JSON.parse(raw);
      // Re‑instantiate Task objects
      return arr.map(
        (obj) => new Task(obj.id, obj.title, obj.description, obj.priority, obj.dueDate, obj.completed)
      );
    } catch (e) {
      console.error("Failed to parse tasks from localStorage", e);
      return [];
    }
  }

  function saveTasks(tasksArray) {
    const plain = tasksArray.map((t) => t.toJSON());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plain));
  }

  // ---------- 3. State Management ----------
  let tasks = loadTasks();
  let currentFilter = "all"; // all | active | completed
  let searchQuery = ""; // lower‑cased string
  let editingTaskId = null; // null when not editing

  function getFilteredTasks() {
    return tasks.filter((task) => {
      // Filter by completed status
      if (currentFilter === "active" && task.completed) return false;
      if (currentFilter === "completed" && !task.completed) return false;
      // Filter by search query
      if (searchQuery) {
        const haystack = `${task.title} ${task.description}`.toLowerCase();
        if (!haystack.includes(searchQuery)) return false;
      }
      return true;
    });
  }

  // ---------- 4. DOM References ----------
  const taskForm = document.getElementById("task-form");
  const titleInput = document.getElementById("task-title");
  const descInput = document.getElementById("task-desc");
  const prioritySelect = document.getElementById("task-priority");
  const dueDateInput = document.getElementById("task-due-date");
  const taskList = document.getElementById("task-list");
  const searchInput = document.getElementById("search-input");
  const filterButtonsContainer = document.getElementById("filter-buttons");
  const filterButtons = filterButtonsContainer.querySelectorAll(".filter-btn");

  // ---------- 9. Utility Functions ----------
  function formatDate(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr;
    // Example format: Sep 12, 2024
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  }

  // ---------- 5. Render Function ----------
  function renderTasks() {
    // Clear existing list
    taskList.innerHTML = "";
    const fragment = document.createDocumentFragment();
    const filtered = getFilteredTasks();
    filtered.forEach((task) => {
      const li = document.createElement("li");
      li.className = "task-item";
      // Priority class (lowercase)
      const priorityClass = `priority-${task.priority.toLowerCase()}`;
      li.classList.add(priorityClass);
      if (task.completed) li.classList.add("completed");

      // Checkbox
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;
      checkbox.className = "task-checkbox";
      checkbox.addEventListener("change", () => {
        task.completed = checkbox.checked;
        saveTasks(tasks);
        renderTasks();
      });

      // Content container
      const contentDiv = document.createElement("div");
      contentDiv.className = "task-content";

      const titleEl = document.createElement("strong");
      titleEl.textContent = task.title;

      const descEl = document.createElement("small");
      descEl.textContent = task.description;

      const metaDiv = document.createElement("div");
      metaDiv.className = "task-meta";

      if (task.dueDate) {
        const dueSpan = document.createElement("span");
        dueSpan.className = "task-due";
        dueSpan.textContent = `Due: ${formatDate(task.dueDate)}`;
        metaDiv.appendChild(dueSpan);
      }

      const priorityBadge = document.createElement("span");
      priorityBadge.className = "task-priority badge";
      priorityBadge.textContent = task.priority;
      metaDiv.appendChild(priorityBadge);

      // Buttons container
      const btnDiv = document.createElement("div");
      btnDiv.className = "task-actions";

      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className = "edit-btn";
      editBtn.textContent = "Edit";
      editBtn.addEventListener("click", () => startEditTask(task.id));

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", () => deleteTask(task.id));

      btnDiv.appendChild(editBtn);
      btnDiv.appendChild(deleteBtn);

      // Assemble content
      contentDiv.appendChild(titleEl);
      if (task.description) contentDiv.appendChild(document.createElement("br"));
      if (task.description) contentDiv.appendChild(descEl);
      contentDiv.appendChild(document.createElement("br"));
      contentDiv.appendChild(metaDiv);

      // Append to li
      li.appendChild(checkbox);
      li.appendChild(contentDiv);
      li.appendChild(btnDiv);

      fragment.appendChild(li);
    });
    taskList.appendChild(fragment);
  }

  // ---------- 6. CRUD Operations ----------
  function resetForm() {
    taskForm.reset();
    // Reset priority to default (Medium) if needed
    prioritySelect.value = "Medium";
    editingTaskId = null;
    document.getElementById("add-task-button").textContent = "Add Task";
  }

  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = titleInput.value.trim();
    if (!title) return; // Title required per HTML
    const description = descInput.value.trim();
    const priority = prioritySelect.value;
    const dueDate = dueDateInput.value; // empty string if not set

    if (editingTaskId) {
      // Edit existing task
      const task = tasks.find((t) => t.id === editingTaskId);
      if (task) {
        task.title = title;
        task.description = description;
        task.priority = priority;
        task.dueDate = dueDate;
        // completed state unchanged
        saveTasks(tasks);
        renderTasks();
        resetForm();
      }
    } else {
      // Add new task
      const id = Date.now().toString();
      const newTask = new Task(id, title, description, priority, dueDate, false);
      tasks.push(newTask);
      saveTasks(tasks);
      renderTasks();
      resetForm();
    }
  });

  function startEditTask(id) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    editingTaskId = id;
    titleInput.value = task.title;
    descInput.value = task.description;
    prioritySelect.value = task.priority;
    dueDateInput.value = task.dueDate;
    document.getElementById("add-task-button").textContent = "Update Task";
    // Optionally focus the title input
    titleInput.focus();
  }

  function deleteTask(id) {
    tasks = tasks.filter((t) => t.id !== id);
    saveTasks(tasks);
    renderTasks();
    // If we were editing this task, reset form
    if (editingTaskId === id) resetForm();
  }

  // ---------- 7. Filtering ----------
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      currentFilter = btn.dataset.filter;
      // Update active class
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderTasks();
    });
  });

  // ---------- 8. Search ----------
  searchInput.addEventListener("input", () => {
    searchQuery = searchInput.value.trim().toLowerCase();
    renderTasks();
  });

  // Keyboard shortcuts for search input
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      renderTasks();
    } else if (e.key === "Escape") {
      searchInput.value = "";
      searchQuery = "";
      renderTasks();
    }
  });

  // ---------- 10. Initialization ----------
  document.addEventListener("DOMContentLoaded", () => {
    // Ensure the default filter button (All) is active – already set in HTML, but enforce.
    const defaultBtn = filterButtonsContainer.querySelector('[data-filter="all"]');
    if (defaultBtn) defaultBtn.classList.add("active");
    renderTasks();
  });
})();
