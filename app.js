import StorageManager from "./storage.js";

// Display Notes
const displayNotes = async () => {
    const notes = (await StorageManager.local.load("notes")) || [];
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
            await StorageManager.ipfs.save("notes", notes); // Sync to IPFS
            displayNotes(); // Refresh view
        }
    });

    // Delete Note
    document.querySelectorAll(".delete-note").forEach((button) => {
        button.addEventListener("click", async (e) => {
            const index = e.target.getAttribute("data-index");
            notes.splice(index, 1);
            StorageManager.local.save("notes", notes); // Save locally
            await StorageManager.ipfs.save("notes", notes); // Sync to IPFS
            displayNotes(); // Refresh view
        });
    });
};

// Display Tasks
const displayTasks = async () => {
    const tasks = (await StorageManager.local.load("tasks")) || [];
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
            await StorageManager.ipfs.save("tasks", tasks); // Sync to IPFS
            displayTasks(); // Refresh view
        }
    });

    // Toggle Task Completion
    document.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
        checkbox.addEventListener("change", async (e) => {
            const index = e.target.getAttribute("data-index");
            tasks[index].completed = e.target.checked;
            StorageManager.local.save("tasks", tasks); // Save locally
            await StorageManager.ipfs.save("tasks", tasks); // Sync to IPFS
            displayTasks(); // Refresh view
        });
    });

    // Delete Task
    document.querySelectorAll(".delete-task").forEach((button) => {
        button.addEventListener("click", async (e) => {
            const index = e.target.getAttribute("data-index");
            tasks.splice(index, 1);
            StorageManager.local.save("tasks", tasks); // Save locally
            await StorageManager.ipfs.save("tasks", tasks); // Sync to IPFS
            displayTasks(); // Refresh view
        });
    });
};

// Export JSON
const exportJSON = async () => {
    const notes = (await StorageManager.local.load("notes")) || [];
    const tasks = (await StorageManager.local.load("tasks")) || [];

    const data = { notes, tasks };
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "backup.json";
    link.click();
};

// Import JSON
const importJSON = (file) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
        const data = JSON.parse(event.target.result);
        if (data.notes) {
            await StorageManager.local.save("notes", data.notes);
            await StorageManager.ipfs.save("notes", data.notes);
        }
        if (data.tasks) {
            await StorageManager.local.save("tasks", data.tasks);
            await StorageManager.ipfs.save("tasks", data.tasks);
        }
        alert("Data imported successfully!");
    };
    reader.readAsText(file);
};

// Navigation
document.getElementById("notes-tab").addEventListener("click", displayNotes);
document.getElementById("tasks-tab").addEventListener("click", displayTasks);
document.getElementById("export-json").addEventListener("click", exportJSON);
document.getElementById("import-json").addEventListener("change", (e) => {
    importJSON(e.target.files[0]);
});

// Load Notes by Default
window.onload = displayNotes;
