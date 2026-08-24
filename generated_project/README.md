# Task Manager

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A lightweight, responsive **Task Manager** web application built with plain **HTML**, **CSS**, and **JavaScript**. It provides full CRUD functionality, filtering, search, and persistent storage using the browser's `localStorage`.

---

## 📖 Description

The Task Manager lets users quickly capture tasks, assign a priority, set an optional due date, and keep track of completion status. Key features include:

- **Create, Read, Update, Delete (CRUD)** operations for tasks.
- **Filtering** – view *All*, *Active*, or *Completed* tasks.
- **Live Search** – filter tasks by title or description as you type.
- **Persistence** – tasks are saved in `localStorage` and survive page reloads.
- **Responsive UI** – works on desktop, tablet, and mobile devices.
- **Theming** – easy colour‑scheme changes via CSS variables.

---

## 📸 Demo Screenshots

> *(Replace the placeholders with actual screenshots when available.)*

```markdown
![Task Manager – Main View](path/to/screenshot-main.png)
![Task Manager – Add/Edit Form](path/to/screenshot-form.png)
![Task Manager – Filtered View](path/to/screenshot-filter.png)
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Markup | HTML5 |
| Styling | CSS3 (custom properties) |
| Behaviour | Vanilla JavaScript (ES6+) |

---

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/task-manager.git
   cd task-manager
   ```
2. **Open the app**
   - Simply open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari).
   - No additional build steps or server are required.

---

## 💡 Usage

### Adding a Task
1. Fill in the **Title** (required) and optional **Description**, **Priority**, and **Due Date** in the **Task Entry Form** (`#task-form`).
2. Click **Add Task** (`#add-task-button`).
3. The new task appears in the list (`#task-list`).

### Editing a Task
1. Click the **Edit** button on a task item (`.edit-btn`).
2. The form is populated with the task’s data and the button text changes to **Update Task**.
3. Modify the fields and press **Update Task** to save changes.

### Deleting a Task
- Press the **Delete** button (`.delete-btn`) on the task you wish to remove.

### Marking Completion
- Toggle the checkbox (`.task-checkbox`) next to a task. Completed tasks receive the `.completed` class for styling.

### Filtering
- Use the filter buttons (`.filter-btn`) in the **Filter Section** to switch between:
  - **All** (`data-filter="all"`)
  - **Active** (`data-filter="active"` – only incomplete tasks)
  - **Completed** (`data-filter="completed"` – only completed tasks)

### Searching
- Type into the search bar (`#search-input`). The list updates in real‑time, matching the query against both the task title and description (case‑insensitive).
- Press **Enter** to force a refresh, or **Escape** to clear the search.

### Persistence
- All tasks are stored under the `studentTaskManager` key in `localStorage`. Closing or refreshing the browser retains the current list.

---

## 📂 File Structure
```
├─ index.html          # Main markup – defines IDs & classes used by the script
├─ styles.css          # Styling, includes CSS variables for theming
├─ script.js           # Core logic – data model, storage, UI rendering, CRUD
└─ README.md           # Project documentation (this file)
```

- **index.html** – Contains semantic sections (`#task-entry`, `#search-section`, `#filter-section`, `#task-list-section`) and the form elements referenced in the JavaScript.
- **styles.css** – Holds layout, colour palette, and responsive rules. Look for the `--primary-color`, `--secondary-color`, etc., variables to customise the theme.
- **script.js** – Implements:
  - `Task` class (data model)
  - `loadTasks` / `saveTasks` (localStorage layer)
  - State variables (`tasks`, `currentFilter`, `searchQuery`, `editingTaskId`)
  - Rendering (`renderTasks`) that uses IDs/classes like `#task-list`, `.task-item`, `.priority-low`, `.completed`.
  - Event listeners for the form, filter buttons, search input, and task actions.

---

## 🎨 Customisation

The app uses CSS custom properties defined at the top of `styles.css`. To change the colour theme, edit the following variables:
```css
:root {
  --primary-color: #2c3e50;   /* Header, buttons */
  --secondary-color: #ecf0f1; /* Backgrounds */
  --accent-low: #27ae60;      /* Low priority badge */
  --accent-medium: #f1c40f;   /* Medium priority badge */
  --accent-high: #e74c3c;     /* High priority badge */
}
```
Adjust the hex values to match your branding, then reload the page.

---

## 🤝 Contributing

Contributions are welcome! Follow these steps:

1. **Fork** the repository.
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit** your changes with clear messages.
4. **Push** to your fork and open a **Pull Request**.
5. Ensure that your code respects the existing naming conventions (IDs, classes, and JavaScript variables) and does not break the existing functionality.

---

## 📄 License

This project is licensed under the **MIT License** – see the `LICENSE` file for details.

---

*Happy task managing!*