import StorageManager from "./storage.js";

// Display Notes
const displayNotes = async () => {
    let notes = StorageManager.local.load("notes") || [];
    const content = document.getElementById("content");
    content.innerHTML = `
        <h2>Notes</h2>
        <div>
            <textarea id="note-input" placeholder="Write a new note here..."></textarea>
            <button id="add-note">Add Note</button>
        </div>
        <ul id="notes-list">
            ${notes.map((note, index) => `<li>${note} <button data-index="${index}" class="delete-note">Delete</button></li>`).join("")}
        </ul>
    `;

    // Add Note
    document.getElementById("add-note").addEventListener("click", async () => {
        const noteInput = document.getElementById("note-input");
        if (noteInput.value.trim() !== "") {
            notes.push(noteInput.value.trim());
            StorageManager.local.save("notes", notes); // Save locally
            displayNotes(); // Refresh view

            // Attempt to sync with IPFS
            try {
                await StorageManager.ipfs.save("notes", notes);
            } catch (error) {
                console.error("Failed to sync notes to IPFS:", error);
            }
        }
    });

    // Delete Note
    document.querySelectorAll(".delete-note").forEach((button) => {
        button.addEventListener("click", async (e) => {
            const index = e.target.getAttribute("data-index");
            notes.splice(index, 1);
            StorageManager.local.save("notes", notes); // Save locally
            displayNotes(); // Refresh view

            // Attempt to sync with IPFS
            try {
                await StorageManager.ipfs.save("notes", notes);
            } catch (error) {
                console.error("Failed to sync notes to IPFS:", error);
            }
        });
    });
};

// Display Tasks
const displayTasks = async () => {
    let tasks = StorageManager.local.load("tasks") || [];
    const content = document.getElementById("content");
    content.innerHTML = `
        <h2>Tasks</h2>
        <div>
            <input type="text" id="task-input" placeholder="Enter a new task" />
            <button id="add-task">Add Task</button>
        </div>
        <ul id="tasks-list">
            ${tasks.map((task, index) =>
                `<li>
                    <input type="checkbox" ${task.completed ? "checked" : ""} data-index="${index}" />
                    <span>${task.text}</span>
                    <button data-index="${index}" class="delete-task">Delete</button>
                </li>`
            ).join("")}
        </ul>
    `;

    // Add Task
    document.getElementById("add-task").addEventListener("click", async () => {
        const taskInput = document.getElementById("task-input");
        if (taskInput.value.trim() !== "") {
            tasks.push({ text: taskInput.value.trim(), completed: false });
            StorageManager.local.save("tasks", tasks); // Save locally
            displayTasks(); // Refresh view

            // Attempt to sync with IPFS
            try {
                await StorageManager.ipfs.save("tasks", tasks);
            } catch (error) {
                console.error("Failed to sync tasks to IPFS:", error);
            }
        }
    });

    // Toggle Task Completion
    document.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
        checkbox.addEventListener("change", async (e) => {
            const index = e.target.getAttribute("data-index");
            tasks[index].completed = e.target.checked;
            StorageManager.local.save("tasks", tasks); // Save locally
            displayTasks(); // Refresh view

            // Attempt to sync with IPFS
            try {
                await StorageManager.ipfs.save("tasks", tasks);
            } catch (error) {
                console.error("Failed to sync tasks to IPFS:", error);
            }
        });
    });

    // Delete Task
    document.querySelectorAll(".delete-task").forEach((button) => {
        button.addEventListener("click", async (e) => {
            const index = e.target.getAttribute("data-index");
            tasks.splice(index, 1);
            StorageManager.local.save("tasks", tasks); // Save locally
            displayTasks(); // Refresh view

            // Attempt to sync with IPFS
            try {
                await StorageManager.ipfs.save("tasks", tasks);
            } catch (error) {
                console.error("Failed to sync tasks to IPFS:", error);
            }
        });
    });
};

// Navigation
document.getElementById("notes-tab").addEventListener("click", displayNotes);
document.getElementById("tasks-tab").addEventListener("click", displayTasks);

// Load Notes by Default
window.onload = displayNotes;
