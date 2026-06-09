import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import DashboardTopBar from "../components/dashboard/DashboardTopBar";
import TaskBoard from "../components/tasks/TaskBoard";
import TaskEditDrawer from "../components/tasks/TaskEditDrawer";
import CreateTaskDrawer from "../components/tasks/CreateTaskDrawer";
import TaskSlideOverPanel from "../components/tasks/TaskSlideOverPanel";
import TaskFullscreenDetail from "../components/tasks/TaskFullscreenDetail";
import TaskWorkspaceToolbar from "../components/tasks/TaskWorkspaceToolbar";
import LabelManagerDrawer from "../components/tasks/LabelManagerDrawer";
import MobileBottomNav from "../components/navigation/MobileBottomNav";
import NoteFormModal from "../components/notes/NoteFormModal";
import TaskNotesWorkspace from "../components/notes/TaskNotesWorkspace";
import { useAuth } from "../hooks/useAuth";
import { useLabels } from "../hooks/useLabels";
import { useSidebar } from "../hooks/useSidebar";
import { useNotes } from "../hooks/useNotes";
import { getApiErrorMessage } from "../utils/errorUtils";
import {
  createTask,
  deleteTask,
  getPrioritizedTasks,
  getTaskById,
  getTasks,
  updateTask,
  updateTaskStatus
} from "../api/taskApi";
import { createNote, deleteNote, getNoteById, updateNote } from "../api/notesApi";
import { buildTaskStatusOptions, normalizeTaskStatus } from "../utils/taskStatus";
import { useToast } from "../components/ui/ToastProvider";

const TASKS_VIEW_MODE_KEY = "lifeos_tasks_view_mode";
const TASKS_WORKSPACE_MODE_KEY = "lifeos_tasks_workspace_mode";
const readInitialViewMode = () => {
  const stored = localStorage.getItem(TASKS_VIEW_MODE_KEY);
  return stored === "grid" ? "grid" : "list";
};
const readInitialWorkspaceMode = () => {
  const stored = localStorage.getItem(TASKS_WORKSPACE_MODE_KEY);
  return stored === "priority" ? "priority" : "standard";
};

const sortTasks = (items, sortBy) => {
  const list = [...items];
  list.sort((a, b) => {
    const aCompleted = a?.status === "COMPLETED";
    const bCompleted = b?.status === "COMPLETED";
    
    if (aCompleted !== bCompleted) {
      return aCompleted ? 1 : -1;
    }
    
    if (sortBy === "titleAsc") return String(a?.title || "").localeCompare(String(b?.title || ""));
    if (sortBy === "titleDesc") return String(b?.title || "").localeCompare(String(a?.title || ""));
    if (sortBy === "dueDesc") {
      return new Date(b?.dueDate || 0).getTime() - new Date(a?.dueDate || 0).getTime();
    }
    if (sortBy === "addedDesc") {
      return (b?.id || 0) - (a?.id || 0);
    }
    return new Date(a?.dueDate || "9999-12-31").getTime() - new Date(b?.dueDate || "9999-12-31").getTime();
  });
  return list;
};
const TASK_SORT_OPTIONS = [
  { value: "dueAsc", label: "Due: Upcoming" },
  { value: "dueDesc", label: "Due: Farthest" },
  { value: "addedDesc", label: "Recently Added" },
  { value: "titleAsc", label: "Title: A-Z" },
  { value: "titleDesc", label: "Title: Z-A" }
];

const matchesSearch = (task, search) => {
  if (!search) return true;
  const keyword = search.toLowerCase();
  return [task?.title, task?.description, task?.label, task?.labelName, task?.taskType]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(keyword));
};

const normalizeTaskDetail = (task, labels = []) => {
  if (!task) return null;
  const resolvedById = labels.find((label) => String(label.id) === String(task.labelId));
  const resolvedByName = labels.find(
    (label) => String(label.name).toLowerCase() === String(task.labelName || task.label || "").toLowerCase()
  );
  const resolvedLabel = resolvedById || resolvedByName || null;

  return {
    ...task,
    label: task.label ?? task.labelName ?? resolvedLabel?.name ?? "",
    labelId: task.labelId ?? resolvedLabel?.id ?? null,
    labelColor: task.labelColor ?? resolvedLabel?.color ?? null
  };
};

const TasksPage = () => {
  const isCollapsed = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const detailRouteTaskId = params.taskId ? Number(params.taskId) : null;
  const detailRouteNoteId = params.noteId ? Number(params.noteId) : null;
  const isFullscreen = Boolean(detailRouteTaskId);
  const isNotesRoute = location.pathname.includes("/notes");
  const { showToast } = useToast();

  const { clearAuth } = useAuth();
  const {
    labels,
    loading: loadingLabels,
    saving: savingLabels,
    error: labelsError,
    createLabel,
    updateLabel: updateLabelMeta,
    deleteLabel: deleteLabelMeta,
    addDefaults
  } = useLabels();

  const [filters, setFilters] = useState({ status: "", labelId: "", taskType: "", search: "" });
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [tasksError, setTasksError] = useState("");
  const [sortBy, setSortBy] = useState("dueAsc");
  const [priorityFocus, setPriorityFocus] = useState([]);
  const [loadingPriorityFocus, setLoadingPriorityFocus] = useState(false);

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
  const [workspaceMode, setWorkspaceMode] = useState(readInitialWorkspaceMode);
  const [isLabelManagerOpen, setIsLabelManagerOpen] = useState(false);
  const [labelInfoMessage, setLabelInfoMessage] = useState("");
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteModalMode, setNoteModalMode] = useState("create");
  const [editingNote, setEditingNote] = useState(null);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [noteError, setNoteError] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [loadingSelectedNote, setLoadingSelectedNote] = useState(false);
  const [selectedNoteError, setSelectedNoteError] = useState("");
  const activeNotesTaskId = isFullscreen ? detailRouteTaskId : selectedTaskId;
  const {
    notes: taskNotes,
    loading: loadingTaskNotes,
    error: taskNotesError,
    refresh: refreshTaskNotes,
    setNotes: setTaskNotes
  } = useNotes(activeNotesTaskId);

  useEffect(() => {
    localStorage.setItem(TASKS_VIEW_MODE_KEY, viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem(TASKS_WORKSPACE_MODE_KEY, workspaceMode);
  }, [workspaceMode]);

  useEffect(() => {
    const intent = new URLSearchParams(location.search).get("intent");
    if (intent === "create") {
      setIsCreateOpen(true);
    }
  }, [location.search]);

  const fetchPriorityTasks = async () => {
    setLoadingPriorityFocus(true);
    try {
      const data = await getPrioritizedTasks();
      setPriorityFocus(Array.isArray(data) ? data : []);
    } catch {
      setPriorityFocus([]);
    } finally {
      setLoadingPriorityFocus(false);
    }
  };

  useEffect(() => {
    fetchPriorityTasks();
  }, []);

  useEffect(() => {
    const fetchTasksList = async () => {
      setLoadingTasks(true);
      setTasksError("");
      setTaskActionError("");
      try {
        const data = await getTasks({
          status: filters.status,
          labelId: filters.labelId,
          taskType: filters.taskType
        });
        const normalized = Array.isArray(data) ? data : [];
        setTasks(sortTasks(normalized, sortBy));
      } catch (error) {
        setTasksError(getApiErrorMessage(error, "Unable to load tasks."));
        setTasks([]);
      } finally {
        setLoadingTasks(false);
      }
    };
    fetchTasksList();
  }, [filters.status, filters.labelId, filters.taskType, sortBy]);

  useEffect(() => {
    const activeTaskId = isFullscreen ? detailRouteTaskId : selectedTaskId;
    if (!activeTaskId) {
      setSelectedTaskDetail(null);
      return;
    }
    const fetchTaskDetail = async () => {
      setLoadingDetail(true);
      try {
        const detail = await getTaskById(activeTaskId);
        setSelectedTaskDetail(normalizeTaskDetail(detail, labels));
      } catch {
        setSelectedTaskDetail(null);
      } finally {
        setLoadingDetail(false);
      }
    };
    fetchTaskDetail();
  }, [detailRouteTaskId, selectedTaskId, isFullscreen, labels]);

  useEffect(() => {
    if (!detailRouteNoteId) {
      setSelectedNote(null);
      setSelectedNoteError("");
      return;
    }

    let active = true;
    const loadNote = async () => {
      setLoadingSelectedNote(true);
      setSelectedNoteError("");
      try {
        const data = await getNoteById(detailRouteNoteId);
        if (!active) return;
        setSelectedNote(data);
      } catch (loadError) {
        if (!active) return;
        setSelectedNote(null);
        setSelectedNoteError(getApiErrorMessage(loadError, "Unable to load note."));
      } finally {
        if (active) setLoadingSelectedNote(false);
      }
    };

    loadNote();
    return () => {
      active = false;
    };
  }, [detailRouteNoteId]);

  const visibleTasks = useMemo(() => {
    const searchedTasks = tasks.filter((task) => matchesSearch(task, filters.search));
    if (workspaceMode !== "priority") return searchedTasks;

    const priorityByTaskId = new Map(
      priorityFocus.map((task, index) => [task?.id, { index, priority: task }])
    );

    return [...searchedTasks]
      .sort((a, b) => {
        const aRank = priorityByTaskId.get(a.id)?.index ?? Number.MAX_SAFE_INTEGER;
        const bRank = priorityByTaskId.get(b.id)?.index ?? Number.MAX_SAFE_INTEGER;
        return aRank - bRank;
      })
      .map((task) => {
        const priorityMeta = priorityByTaskId.get(task.id)?.priority;
        if (!priorityMeta) return task;
        return {
          ...task,
          priorityScore: priorityMeta.priorityScore,
          smartPriority: priorityMeta.smartPriority,
          reasons: priorityMeta.reasons
        };
      });
  }, [tasks, filters.search, workspaceMode, priorityFocus]);
  const taskTypeOptions = useMemo(
    () => Array.from(new Set(tasks.map((task) => String(task?.taskType || "").trim()).filter(Boolean))),
    [tasks]
  );

  const applyTaskUpdate = (updatedTask) => {
    if (!updatedTask?.id) return;
    const normalized = normalizeTaskDetail(updatedTask, labels);
    setTasks((prev) =>
      sortTasks(
        prev.map((task) =>
          task.id === normalized.id
            ? { ...task, ...normalized, label: normalized.label || task.label || task.labelName }
            : task
        ),
        sortBy
      )
    );
    setSelectedTaskDetail((prev) => (prev?.id === normalized.id ? { ...prev, ...normalized } : prev));
    fetchPriorityTasks();
  };

  const handleCreateTask = async (payload) => {
    setIsCreateOpen(false);
    setCreateTaskError("");
    
    const tempId = `temp-${Date.now()}`;
    const optimisticTask = normalizeTaskDetail({
      id: tempId,
      ...payload,
      status: payload.status || "TO_DO",
      priority: "NORMAL",
      createdAt: new Date().toISOString()
    }, labels);

    setTasks((prev) => sortTasks([optimisticTask, ...prev], sortBy));
    
    try {
      const createdTask = await createTask(payload);
      const normalizedCreatedTask = normalizeTaskDetail(createdTask, labels);
      setTasks((prev) =>
        sortTasks(
          [{ ...normalizedCreatedTask }, ...prev.filter((task) => task.id !== tempId && task.id !== normalizedCreatedTask.id)],
          sortBy
        )
      );
      if (selectedTaskId === tempId || !selectedTaskId) {
        setSelectedTaskId(normalizedCreatedTask.id);
        setSelectedTaskDetail(normalizedCreatedTask);
      }
      fetchPriorityTasks();
      showToast("Task created");
    } catch (error) {
      setTasks((prev) => prev.filter((t) => t.id !== tempId));
      setCreateTaskError(getApiErrorMessage(error, "Unable to create task."));
      showToast("Unable to create task", "error");
      setIsCreateOpen(true);
    }
  };

  const handleSaveTask = async (payload) => {
    if (!selectedTaskDetail?.id) return;
    setTaskActionError("");
    setIsEditOpen(false);
    
    const previousTask = selectedTaskDetail;
    const { status, ...taskPayload } = payload;
    const normalizedStatus = normalizeTaskStatus(status);
    
    const optimisticTask = normalizeTaskDetail({
      ...selectedTaskDetail,
      ...taskPayload,
      status: normalizedStatus || selectedTaskDetail.status
    }, labels);
    
    applyTaskUpdate(optimisticTask);

    try {
      const updated = await updateTask(selectedTaskDetail.id, taskPayload);
      const currentStatus = normalizeTaskStatus(updated?.status);
      const finalTask =
        normalizedStatus && normalizedStatus !== currentStatus
          ? await updateTaskStatus(selectedTaskDetail.id, normalizedStatus)
          : updated;
      applyTaskUpdate(finalTask);
      showToast("Task updated");
    } catch (error) {
      applyTaskUpdate(previousTask);
      setTaskActionError(getApiErrorMessage(error, "Unable to update task."));
      showToast("Unable to update task", "error");
      setIsEditOpen(true);
    }
  };

  const handleStatusChange = async (nextStatus) => {
    if (!selectedTaskDetail?.id) return;
    const normalizedStatus = normalizeTaskStatus(nextStatus);
    if (!normalizedStatus) return;

    setTaskActionError("");
    const previousTask = selectedTaskDetail;
    
    const optimisticTask = { ...selectedTaskDetail, status: normalizedStatus };
    applyTaskUpdate(optimisticTask);

    try {
      const updated = await updateTaskStatus(selectedTaskDetail.id, normalizedStatus);
      applyTaskUpdate(updated);
      showToast("Status updated");
    } catch (error) {
      applyTaskUpdate(previousTask);
      setTaskActionError(getApiErrorMessage(error, "Unable to update task status."));
      showToast("Unable to update task status", "error");
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTaskDetail?.id) return;
    const deletingId = selectedTaskDetail.id;
    const previousTasks = tasks;
    setTaskActionError("");
    setTasks((prev) => prev.filter((task) => task.id !== deletingId));
    setSelectedTaskDetail(null);
    setIsEditOpen(false);
    if (isFullscreen) {
      navigate("/tasks");
    } else {
      setSelectedTaskId(null);
    }
    try {
      await deleteTask(deletingId);
      fetchPriorityTasks();
      showToast("Task deleted");
    } catch (error) {
      setTasks(previousTasks);
      setTaskActionError(getApiErrorMessage(error, "Unable to delete task."));
      showToast("Unable to delete task", "error");
      if (!isFullscreen) {
        setSelectedTaskId(deletingId);
      }
    }
  };

  const handleLabelChange = async (nextLabelId) => {
    if (!selectedTaskDetail?.id) return;
    setTaskActionError("");
    
    const previousTask = selectedTaskDetail;
    const optimisticTask = normalizeTaskDetail({
      ...selectedTaskDetail,
      labelId: nextLabelId ? Number(nextLabelId) : null
    }, labels);
    applyTaskUpdate(optimisticTask);

    try {
      const updated = await updateTask(selectedTaskDetail.id, {
        title: selectedTaskDetail.title ?? "",
        description: selectedTaskDetail.description ?? "",
        taskType: selectedTaskDetail.taskType ?? "",
        dueDate: selectedTaskDetail.dueDate ?? null,
        labelId: nextLabelId ? Number(nextLabelId) : null
      });
      applyTaskUpdate(updated);
      showToast("Label updated");
    } catch (error) {
      applyTaskUpdate(previousTask);
      setTaskActionError(getApiErrorMessage(error, "Unable to update label."));
      showToast("Unable to update label", "error");
    }
  };

  const openCreateNote = () => {
    setEditingNote(null);
    setNoteModalMode("create");
    setNoteError("");
    setIsNoteModalOpen(true);
  };

  const openEditNote = (note) => {
    if (!note) return;
    setEditingNote(note);
    setNoteModalMode("edit");
    setNoteError("");
    setIsNoteModalOpen(true);
  };

  const closeNoteModal = () => {
    if (isSavingNote) return;
    setIsNoteModalOpen(false);
    setEditingNote(null);
    setNoteError("");
  };

  const handleSubmitNote = async (payload) => {
    setIsSavingNote(true);
    setNoteError("");

    const shouldRefresh = true;

    if (noteModalMode === "edit" && editingNote?.id) {
      const previousNote = editingNote;
      const optimisticNote = {
        ...previousNote,
        ...payload,
        taskId: payload.taskId,
        updatedAt: new Date().toISOString()
      };

      setSelectedNote((prev) => (prev?.id === previousNote.id ? optimisticNote : prev));
      setTaskNotes((prev) =>
        prev.map((note) => (note.id === previousNote.id ? optimisticNote : note))
      );

      try {
        const updated = await updateNote({ noteId: previousNote.id, ...payload });
        setSelectedNote((prev) => (prev?.id === updated.id ? updated : prev));
        setTaskNotes((prev) =>
          prev
            .map((note) => (note.id === updated.id ? updated : note))
            .filter((note) => !activeNotesTaskId || note.taskId === activeNotesTaskId)
        );
        showToast("Note updated");
        setIsNoteModalOpen(false);
        setEditingNote(null);
      } catch (saveError) {
        setNoteError(getApiErrorMessage(saveError, "Unable to update note."));
        showToast("Unable to update note", "error");
        setSelectedNote(previousNote);
        refreshTaskNotes();
      } finally {
        setIsSavingNote(false);
      }
      return;
    }

    const tempId = `temp-${Date.now()}`;
    const optimisticNote = {
      id: tempId,
      title: payload.title,
      message: payload.message,
      taskId: payload.taskId,
      taskTitle: payload.taskId ? selectedTaskDetail?.title || taskNotes.find((item) => String(item.taskId) === String(payload.taskId))?.taskTitle || "" : "",
      updatedAt: new Date().toISOString()
    };

    if (!payload.taskId || String(payload.taskId) === String(activeNotesTaskId)) {
      setTaskNotes((prev) => [optimisticNote, ...prev]);
    }

    try {
      const created = await createNote(payload);
      setTaskNotes((prev) =>
        [created, ...prev.filter((note) => note.id !== tempId)].filter(
          (note) => !activeNotesTaskId || String(note.taskId || "") === String(activeNotesTaskId)
        )
      );
      showToast("Note created");
      setIsNoteModalOpen(false);
      setEditingNote(null);
      refreshTaskNotes();
    } catch (saveError) {
      setTaskNotes((prev) => prev.filter((note) => note.id !== tempId));
      setNoteError(getApiErrorMessage(saveError, "Unable to create note."));
      showToast("Unable to create note", "error");
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleDeleteNote = async (note) => {
    if (!note?.id) return;
    const noteIdToDelete = note.id;
    const previousNotes = taskNotes;

    setTaskNotes((prev) => prev.filter((item) => item.id !== noteIdToDelete));
    if (selectedNote?.id === noteIdToDelete) {
      setSelectedNote(null);
    }

    try {
      await deleteNote(noteIdToDelete);
      showToast("Note deleted");
      refreshTaskNotes();
      if (detailRouteNoteId) {
        navigate(`/tasks/${detailRouteTaskId}/notes`, { replace: true });
      }
    } catch (deleteError) {
      setTaskNotes(previousNotes);
      if (selectedNote?.id === noteIdToDelete) {
        setSelectedNote(note);
      }
      setNoteError(getApiErrorMessage(deleteError, "Unable to delete note."));
      showToast("Unable to delete note", "error");
    }
  };

  const openNoteDetail = (note) => {
    const taskId = note?.taskId || activeNotesTaskId || detailRouteTaskId || selectedTaskId;
    if (!note?.id || !taskId) return;
    navigate(`/tasks/${taskId}/notes/${note.id}`);
  };

  const statusOptions = useMemo(
    () => buildTaskStatusOptions(tasks.map((task) => task.status), selectedTaskDetail?.status),
    [tasks, selectedTaskDetail]
  );

  return (
    <div className="bg-background text-on-surface">
      <DashboardSidebar onLogout={clearAuth} activeView="tasks" />
      <DashboardTopBar />

      <main className={`ml-0 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'} p-md lg:p-xl pb-[84px] md:pb-xl min-h-screen transition-all duration-300 ease-in-out`}>
        {!isFullscreen ? (
          <div className="max-w-container-max mx-auto space-y-md">
            <TaskWorkspaceToolbar
              filters={filters}
              onChangeFilters={setFilters}
              sortBy={sortBy}
              onChangeSortBy={setSortBy}
              sortOptions={TASK_SORT_OPTIONS}
              taskTypeOptions={taskTypeOptions}
              viewMode={viewMode}
              onChangeViewMode={setViewMode}
              workspaceMode={workspaceMode}
              onChangeWorkspaceMode={setWorkspaceMode}
              onCreateTask={() => setIsCreateOpen(true)}
              statusOptions={statusOptions}
              labels={labels}
              onOpenLabelManager={() => setIsLabelManagerOpen(true)}
            />
            {taskActionError ? <p className="text-error text-label-sm">{taskActionError}</p> : null}
            <TaskBoard
              tasks={visibleTasks}
              selectedTaskId={selectedTaskId}
              onSelectTask={setSelectedTaskId}
              loading={loadingTasks || (workspaceMode === "priority" && loadingPriorityFocus)}
              error={tasksError}
              viewMode={viewMode}
              priorityView={workspaceMode === "priority"}
            />
          </div>
        ) : (
          <div className="max-w-container-max mx-auto space-y-md">
            <div className="flex items-center gap-xs border-b border-outline-variant pb-xs">
              <button
                type="button"
                onClick={() => navigate(`/tasks/${detailRouteTaskId}`)}
                className={`rounded-t-lg px-md py-xs text-label-sm ${!isNotesRoute ? "border-b-2 border-primary text-primary" : "text-on-surface-variant"}`}
              >
                Overview
              </button>
              <button
                type="button"
                onClick={() => navigate(`/tasks/${detailRouteTaskId}/notes`)}
                className={`rounded-t-lg px-md py-xs text-label-sm ${isNotesRoute ? "border-b-2 border-primary text-primary" : "text-on-surface-variant"}`}
              >
                Notes
              </button>
            </div>

            {isNotesRoute ? (
              <TaskNotesWorkspace
                task={selectedTaskDetail}
                notes={taskNotes}
                loading={loadingTaskNotes}
                error={taskNotesError || selectedNoteError}
              selectedNote={selectedNote}
              selectedNoteLoading={loadingSelectedNote}
              selectedNoteError={selectedNoteError}
              onBackToTask={() => navigate(`/tasks/${detailRouteTaskId}`)}
              onBackToNotesList={() => navigate(`/tasks/${detailRouteTaskId}/notes`)}
              onCreateNote={() => openCreateNote(detailRouteTaskId)}
              onViewNote={openNoteDetail}
              onEditNote={openEditNote}
              onDeleteNote={handleDeleteNote}
            />
            ) : (
              <TaskFullscreenDetail
                task={selectedTaskDetail}
                loading={loadingDetail}
                onBack={() => navigate("/tasks")}
                onEdit={() => setIsEditOpen(true)}
                onDelete={handleDeleteTask}
                deleting={deletingTask}
                onStatusChange={handleStatusChange}
                statusUpdating={statusUpdatingTask}
                labels={labels}
                statusOptions={statusOptions}
                onLabelChange={handleLabelChange}
                notes={taskNotes}
                onViewAllNotes={() => navigate(`/tasks/${detailRouteTaskId}/notes`)}
                onViewNote={openNoteDetail}
              />
            )}
          </div>
        )}
      </main>

      {!isFullscreen && selectedTaskId ? (
        <TaskSlideOverPanel
          task={selectedTaskDetail}
          loading={loadingDetail}
          onClose={() => setSelectedTaskId(null)}
          onExpand={(taskId) => navigate(`/tasks/${taskId}`)}
          onEdit={() => setIsEditOpen(true)}
          onDelete={handleDeleteTask}
          deleting={deletingTask}
          onStatusChange={handleStatusChange}
          statusUpdating={statusUpdatingTask}
          labels={labels}
          statusOptions={statusOptions}
          onLabelChange={handleLabelChange}
          notesPreview={taskNotes}
          notesCount={taskNotes.length}
          onCreateNote={() => openCreateNote(selectedTaskId)}
          onViewAllNotes={() => navigate(`/tasks/${selectedTaskId}/notes`)}
          onOpenNote={openNoteDetail}
        />
      ) : null}

      <TaskEditDrawer
        task={selectedTaskDetail}
        isOpen={isEditOpen}
        isSaving={savingTask}
        error={taskActionError}
        statusOptions={statusOptions}
        labels={labels}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSaveTask}
      />

      <CreateTaskDrawer
        isOpen={isCreateOpen}
        isCreating={creatingTask}
        error={createTaskError}
        statusOptions={statusOptions}
        labels={labels}
        onClose={() => {
          if (creatingTask) return;
          setIsCreateOpen(false);
          setCreateTaskError("");
        }}
        onCreateTask={handleCreateTask}
      />

      <LabelManagerDrawer
        isOpen={isLabelManagerOpen}
        labels={labels}
        loading={loadingLabels}
        saving={savingLabels}
        error={labelsError}
        infoMessage={labelInfoMessage}
        onClose={() => {
          setIsLabelManagerOpen(false);
          setLabelInfoMessage("");
        }}
        onCreateLabel={async (payload) => {
          setLabelInfoMessage("");
          await createLabel(payload);
        }}
        onUpdateLabel={async (labelId, payload) => {
          setLabelInfoMessage("");
          await updateLabelMeta(labelId, payload);
        }}
        onDeleteLabel={async (labelId) => {
          setLabelInfoMessage("");
          await deleteLabelMeta(labelId);
        }}
        onSeedDefaults={async () => {
          try {
            await addDefaults();
            setLabelInfoMessage("Recommended labels added successfully.");
          } catch {
            setLabelInfoMessage("Recommended labels are already available.");
          }
        }}
      />

      <NoteFormModal
        isOpen={isNoteModalOpen}
        mode={noteModalMode}
        note={editingNote}
        defaultTaskId={activeNotesTaskId || ""}
        isSaving={isSavingNote}
        error={noteError}
        onClose={closeNoteModal}
        onSubmit={handleSubmitNote}
      />

      {!isFullscreen ? <MobileBottomNav activeView="tasks" /> : null}
    </div>
  );
};

export default TasksPage;
