import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createTask,
  deleteTask,
  getTasks,
  getMe,
  Task,
  updateTask,
  UserProfile,
} from "../lib/api";
import { removeToken } from "../utils/auth";

export default function Tasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [creating, setCreating] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">(
    "medium"
  );

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState<
    "low" | "medium" | "high"
  >("medium");

  function showToast(message: string, type: "success" | "error" = "success") {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  }

  async function loadTasks() {
    try {
      setLoading(true);
      setError("");

      const [data, profile] = await Promise.all([
        getTasks(),
        getMe().catch(() => null),
      ]);
      setTasks(data);
      if (profile) {
        setUserProfile(profile);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load tasks"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  function handleLogout() {
    removeToken();
    showToast("Logged out successfully");
    navigate("/login");
  }

  async function handleCreateTask(event: FormEvent) {
    event.preventDefault();

    if (!title.trim()) {
      setError("Task title is required");
      showToast("Task title is required", "error");
      return;
    }

    try {
      setCreating(true);
      setError("");

      const newTask = await createTask({
        title: title.trim(),
        description: description.trim(),
        priority,
      });

      setTasks((currentTasks) => [newTask, ...currentTasks]);

      setTitle("");
      setDescription("");
      setPriority("medium");

      showToast("Task created successfully!");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create task";

      setError(message);
      showToast(message, "error");
    } finally {
      setCreating(false);
    }
  }

  function startEditing(task: Task) {
    setEditingId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setEditPriority(task.priority);
  }

  function cancelEditing() {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
    setEditPriority("medium");
  }

  async function handleUpdateTask(event: FormEvent) {
    event.preventDefault();

    if (!editingId || !editTitle.trim()) {
      setError("Task title is required");
      showToast("Task title is required", "error");
      return;
    }

    try {
      setUpdatingId(editingId);
      setError("");

      const updatedTask = await updateTask(editingId, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        priority: editPriority,
      });

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task._id === editingId ? updatedTask : task
        )
      );

      cancelEditing();

      showToast("Task updated successfully!");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update task";

      setError(message);
      showToast(message, "error");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleToggleComplete(task: Task) {
    try {
      setTogglingId(task._id);
      setError("");

      const updatedTask = await updateTask(task._id, {
        title: task.title,
        description: task.description || "",
        priority: task.priority,
        completed: !task.completed,
      });

      setTasks((currentTasks) =>
        currentTasks.map((item) =>
          item._id === task._id ? updatedTask : item
        )
      );

      showToast(
        updatedTask.completed
          ? "Task marked as completed!"
          : "Task marked as pending!"
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to update task status";

      setError(message);
      showToast(message, "error");
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDeleteTask(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");

      await deleteTask(id);

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task._id !== id)
      );

      showToast("Task deleted successfully!");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete task";

      setError(message);
      showToast(message, "error");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        {toast && (
          <div
            className={`fixed right-6 top-6 z-50 rounded-lg px-5 py-4 text-sm font-medium text-white shadow-lg ${
              toast.type === "success"
                ? "bg-green-600"
                : "bg-red-600"
            }`}
          >
            {toast.message}
          </div>
        )}

        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
              Practical 7 Authentication & Middleware Pipeline
            </p>

            <h1 className="text-4xl font-bold text-slate-900">
              Task Manager
            </h1>

            <p className="mt-2 text-slate-600">
              Manage JWT-protected tasks connected to the Express & MongoDB backend.
            </p>

            {userProfile?.email && (
              <p className="mt-1 text-sm font-medium text-slate-700">
                Logged in as: <span className="text-blue-600 font-semibold">{userProfile.email}</span>
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition shadow-sm"
            >
              Sign Out
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {/* Create Task */}
        <section className="mb-10 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-5 text-xl font-semibold text-slate-900">
            Create New Task
          </h2>

          <form onSubmit={handleCreateTask} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Enter task title"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Description
              </label>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Enter task description"
                rows={3}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Priority
              </label>

              <select
                value={priority}
                onChange={(event) =>
                  setPriority(event.target.value as "low" | "medium" | "high")
                }
                className="rounded-lg border border-slate-400 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
                style={{ color: "#1e293b", backgroundColor: "#ffffff" }}
              >
                <option value="low" style={{ color: "#1e293b", backgroundColor: "#ffffff" }}>
                  Low
                </option>

                <option value="medium" style={{ color: "#1e293b", backgroundColor: "#ffffff" }}>
                  Medium
                </option>

                <option value="high" style={{ color: "#1e293b", backgroundColor: "#ffffff" }}>
                  High
                </option>
              </select>
            </div>

            <button
              type="submit"
              disabled={creating}
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {creating ? "Adding..." : "Add Task"}
            </button>
          </form>
        </section>

        {/* Tasks List */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">
              Your Tasks
            </h2>

            <button
              onClick={loadTasks}
              disabled={loading}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {loading ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <p className="text-slate-500">Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
              <p className="text-lg font-medium text-slate-700">
                No tasks found
              </p>

              <p className="mt-2 text-slate-500">
                Create your first task using the form above.
              </p>
            </div>
          ) : (
            <div className="grid gap-5">
              {tasks.map((task) => (
                <article
                  key={task._id}
                  className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
                >
                  {editingId === task._id ? (
                    <form
                      onSubmit={handleUpdateTask}
                      className="space-y-4"
                    >
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(event) =>
                          setEditTitle(event.target.value)
                        }
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500"
                      />

                      <textarea
                        value={editDescription}
                        onChange={(event) =>
                          setEditDescription(event.target.value)
                        }
                        rows={3}
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500"
                      />

                      <select
                        value={editPriority}
                        onChange={(event) =>
                          setEditPriority(
                            event.target.value as "low" | "medium" | "high"
                          )
                        }
                        className="rounded-lg border border-slate-400 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
                        style={{ color: "#1e293b", backgroundColor: "#ffffff" }}
                      >
                        <option
                          value="low"
                          style={{ color: "#1e293b", backgroundColor: "#ffffff" }}
                        >
                          Low
                        </option>

                        <option
                          value="medium"
                          style={{ color: "#1e293b", backgroundColor: "#ffffff" }}
                        >
                          Medium
                        </option>

                        <option
                          value="high"
                          style={{ color: "#1e293b", backgroundColor: "#ffffff" }}
                        >
                          High
                        </option>
                      </select>

                      <div className="flex gap-3">
                        <button
                          type="submit"
                          disabled={updatingId === task._id}
                          className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {updatingId === task._id ? "Saving..." : "Save Changes"}
                        </button>

                        <button
                          type="button"
                          onClick={cancelEditing}
                          className="rounded-lg border border-slate-300 px-5 py-2 font-medium text-slate-700 hover:bg-slate-100"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3
                              className={`text-xl font-semibold ${
                                task.completed
                                  ? "text-slate-400 line-through"
                                  : "text-slate-900"
                              }`}
                            >
                              {task.title}
                            </h3>

                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-600">
                              {task.priority}
                            </span>

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                task.completed
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {task.completed
                                ? "Completed"
                                : "Pending"}
                            </span>
                          </div>

                          {task.description && (
                            <p className="mt-3 text-slate-600">
                              {task.description}
                            </p>
                          )}

                          {task.createdAt && (
                            <p className="mt-3 text-xs text-slate-400">
                              Created:{" "}
                              {new Date(
                                task.createdAt
                              ).toLocaleString()}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleToggleComplete(task)}
                            disabled={togglingId === task._id}
                            className="rounded-lg border border-green-300 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {togglingId === task._id
                              ? "Updating..."
                              : task.completed
                              ? "Mark Pending"
                              : "Complete"}
                          </button>

                          <button
                            onClick={() => startEditing(task)}
                            className="rounded-lg border border-blue-300 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDeleteTask(task._id)}
                            disabled={deletingId === task._id}
                            className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {deletingId === task._id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
