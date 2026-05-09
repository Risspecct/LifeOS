import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import DashboardTopBar from "../components/dashboard/DashboardTopBar";
import TaskFiltersBar from "../components/tasks/TaskFiltersBar";
import TaskBoard from "../components/tasks/TaskBoard";
import TaskDetailsSidebar from "../components/tasks/TaskDetailsSidebar";
import TaskEditDrawer from "../components/tasks/TaskEditDrawer";
import CreateTaskDrawer from "../components/tasks/CreateTaskDrawer";
import TaskWorkspaceHeader from "../components/tasks/TaskWorkspaceHeader";
import { useAuth } from "../hooks/useAuth";
import { getApiErrorMessage } from "../utils/errorUtils";
import { createTask, deleteTask, getTaskById, getTasks, updateTask, updateTaskStatus } from "../api/taskApi";
import { buildTaskStatusOptions, normalizeTaskStatus } from "../utils/taskStatus";

const matchesTaskFilters = (task, filters) => {
  const matchesStatus = !filters.status || normalizeTaskStatus(task?.status) === normalizeTaskStatus(filters.status);
  const matchesLabel = !filters.label || String(task?.label ?? "").toLowerCase().includes(filters.label.toLowerCase());
  const matchesType = !filters.taskType || String(task?.taskType ?? "").toLowerCase().includes(filters.taskType.toLowerCase());
  return matchesStatus && matchesLabel && matchesType;
};

const sortTasksByDueDate = (items) =>
  [...items].sort((a, b) => {
    if (!a?.dueDate) return 1;
    if (!b?.dueDate) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

const TASKS_VIEW_MODE_KEY = "campusos_tasks_view_mode";
const readInitialViewMode = () => {
  const stored = localStorage.getItem(TASKS_VIEW_MODE_KEY);
  return stored === "grid" ? "grid" : "list";
};

const TasksPage = () => {
  const navigate = useNavigate();
  const { clearAuth } = useAuth();

  const [filters, setFilters] = useState({ status: "", label: "", taskType: "" });
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [tasksError, setTasksError] = useState("");

  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [selectedTaskDetail, setSelectedTaskDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [savingTask, setSavingTask] = useState(false);
  const [deletingTask, setDeletingTask] = useState(false);
  const [statusUpdatingTask, setStatusUpdatingTask] = useState(false);
  const [taskActionError, setTaskActionError] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [creatingTask, setCreatingTask] = useState(false);
  const [createTaskError, setCreateTaskError] = useState("");
  const [viewMode, setViewMode] = useState(readInitialViewMode);

  useEffect(() => {
    localStorage.setItem(TASKS_VIEW_MODE_KEY, viewMode);
  }, [viewMode]);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoadingTasks(true);
      setTasksError("");
      setTaskActionError("");
      try {
        const data = await getTasks(filters);
        const normalized = Array.isArray(data) ? data : [];
        const sorted = sortTasksByDueDate(normalized);
        setTasks(sorted);
        if (sorted.length > 0) {
          setSelectedTaskId((prev) => (sorted.some((task) => task.id === prev) ? prev : sorted[0].id));
        } else {
          setSelectedTaskId(null);
          setSelectedTaskDetail(null);
        }
      } catch (error) {
        setTasksError(getApiErrorMessage(error, "Unable to load tasks."));
        setTasks([]);
      } finally {
        setLoadingTasks(false);
      }
    };

    fetchTasks();
  }, [filters]);

  useEffect(() => {
    const fetchTaskDetail = async () => {
      if (!selectedTaskId) {
        setSelectedTaskDetail(null);
        return;
      }
      setLoadingDetail(true);
      try {
        const detail = await getTaskById(selectedTaskId);
        setSelectedTaskDetail(detail);
      } catch {
        setSelectedTaskDetail(null);
      } finally {
        setLoadingDetail(false);
      }
    };
    fetchTaskDetail();
  }, [selectedTaskId]);

  const applyTaskUpdate = (updatedTask) => {
    if (!updatedTask?.id) return;
    const shouldRemainVisible = matchesTaskFilters(updatedTask, filters);
    setTasks((prev) => {
      const withoutCurrent = prev.filter((task) => task.id !== updatedTask.id);
      return shouldRemainVisible ? sortTasksByDueDate([...withoutCurrent, { ...updatedTask }]) : withoutCurrent;
    });
    if (shouldRemainVisible) {
      setSelectedTaskDetail((prev) => (prev?.id === updatedTask.id ? { ...prev, ...updatedTask } : prev));
    } else {
      setSelectedTaskId((prev) => (prev === updatedTask.id ? null : prev));
      setSelectedTaskDetail((prev) => (prev?.id === updatedTask.id ? null : prev));
    }
  };

  const handleCreateTask = async (payload) => {
    setCreatingTask(true);
    setCreateTaskError("");
    try {
      const createdTask = await createTask(payload);
      const shouldAppearInBoard = matchesTaskFilters(createdTask, filters);
      if (shouldAppearInBoard) {
        setTasks((prev) => sortTasksByDueDate([{ ...createdTask }, ...prev.filter((task) => task.id !== createdTask.id)]));
      }
      setSelectedTaskId(createdTask.id);
      setSelectedTaskDetail(createdTask);
      setIsCreateOpen(false);
    } catch (error) {
      setCreateTaskError(getApiErrorMessage(error, "Unable to create task."));
    } finally {
      setCreatingTask(false);
    }
  };

  const handleSaveTask = async (payload) => {
    if (!selectedTaskId) return;
    setSavingTask(true);
    setTaskActionError("");
    try {
      const { status, ...taskPayload } = payload;
      const updated = await updateTask(selectedTaskId, taskPayload);
      const normalizedStatus = normalizeTaskStatus(status);
      const currentStatus = normalizeTaskStatus(updated?.status);
      const finalTask =
        normalizedStatus && normalizedStatus !== currentStatus
          ? await updateTaskStatus(selectedTaskId, normalizedStatus)
          : updated;
      applyTaskUpdate(finalTask);
      setIsEditOpen(false);
    } catch (error) {
      setTaskActionError(getApiErrorMessage(error, "Unable to update task."));
    } finally {
      setSavingTask(false);
    }
  };

  const handleStatusChange = async (nextStatus) => {
    if (!selectedTaskId) return;
    const normalizedStatus = normalizeTaskStatus(nextStatus);
    if (!normalizedStatus) return;

    setStatusUpdatingTask(true);
    setTaskActionError("");
    try {
      const updated = await updateTaskStatus(selectedTaskId, normalizedStatus);
      applyTaskUpdate(updated);
    } catch (error) {
      setTaskActionError(getApiErrorMessage(error, "Unable to update task status."));
    } finally {
      setStatusUpdatingTask(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTaskId) return;
    const deletingId = selectedTaskId;
    const previousTasks = tasks;
    setDeletingTask(true);
    setTaskActionError("");
    setTasks((prev) => prev.filter((task) => task.id !== deletingId));
    setSelectedTaskId(null);
    setSelectedTaskDetail(null);
    setIsEditOpen(false);
    try {
      await deleteTask(deletingId);
    } catch (error) {
      setTasks(previousTasks);
      setSelectedTaskId(deletingId);
      setTaskActionError(getApiErrorMessage(error, "Unable to delete task."));
    } finally {
      setDeletingTask(false);
    }
  };

  const taskCountLabel = useMemo(() => `${tasks.length} active results`, [tasks.length]);
  const statusOptions = useMemo(
    () =>
      buildTaskStatusOptions(
        tasks.map((task) => task.status),
        selectedTaskDetail?.status
      ),
    [tasks, selectedTaskDetail]
  );

  return (
    <div className="bg-background text-on-surface">
      <DashboardSidebar onLogout={clearAuth} activeView="tasks" />
      <DashboardTopBar />

      <main className="ml-0 md:ml-64 p-md lg:p-xl min-h-screen">
        <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-10 gap-xl">
          <section className="lg:col-span-6 space-y-md">
            <TaskWorkspaceHeader
              taskCountLabel={taskCountLabel}
              onCreateTask={() => setIsCreateOpen(true)}
              viewMode={viewMode}
              onChangeViewMode={setViewMode}
            />
            <TaskFiltersBar filters={filters} onChangeFilters={setFilters} statusOptions={statusOptions} />
            {taskActionError ? <p className="text-error text-label-sm">{taskActionError}</p> : null}
            <TaskBoard
              tasks={tasks}
              selectedTaskId={selectedTaskId}
              onSelectTask={setSelectedTaskId}
              loading={loadingTasks}
              error={tasksError}
              viewMode={viewMode}
            />
          </section>

          <aside className="lg:col-span-4">
            <div className="hidden lg:block">
              <TaskDetailsSidebar
                task={selectedTaskDetail}
                loading={loadingDetail}
                deleting={deletingTask}
                statusUpdating={statusUpdatingTask}
                statusOptions={statusOptions}
                onEdit={() => setIsEditOpen(true)}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
                onClose={() => {
                  setSelectedTaskId(null);
                  setSelectedTaskDetail(null);
                }}
              />
            </div>
          </aside>
        </div>
      </main>

      {selectedTaskDetail ? (
        <div className="lg:hidden fixed inset-0 z-50 p-md bg-black/60">
          <div className="max-h-full overflow-auto">
            <TaskDetailsSidebar
              task={selectedTaskDetail}
              loading={loadingDetail}
              deleting={deletingTask}
              statusUpdating={statusUpdatingTask}
              statusOptions={statusOptions}
              onEdit={() => setIsEditOpen(true)}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
              onClose={() => {
                setSelectedTaskId(null);
                setSelectedTaskDetail(null);
              }}
            />
          </div>
        </div>
      ) : null}

      <TaskEditDrawer
        task={selectedTaskDetail}
        isOpen={isEditOpen}
        isSaving={savingTask}
        error={taskActionError}
        statusOptions={statusOptions}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSaveTask}
      />

      <CreateTaskDrawer
        isOpen={isCreateOpen}
        isCreating={creatingTask}
        error={createTaskError}
        statusOptions={statusOptions}
        onClose={() => {
          if (creatingTask) return;
          setIsCreateOpen(false);
          setCreateTaskError("");
        }}
        onCreateTask={handleCreateTask}
      />

      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-sm py-xs bg-surface border-t border-outline-variant md:hidden">
        <button type="button" onClick={() => navigate("/dashboard")} className="flex flex-col items-center justify-center text-on-surface-variant p-xs">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="font-label-sm text-label-sm">Dashboard</span>
        </button>
        <button type="button" onClick={() => navigate("/tasks")} className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-xl p-xs">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>checklist</span>
          <span className="font-label-sm text-label-sm">Tasks</span>
        </button>
        <button type="button" onClick={() => navigate("/profile")} className="flex flex-col items-center justify-center text-on-surface-variant p-xs">
          <span className="material-symbols-outlined">person</span>
          <span className="font-label-sm text-label-sm">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default TasksPage;
