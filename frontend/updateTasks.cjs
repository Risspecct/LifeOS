const fs = require('fs');
const file = 'c:/Users/Rishi/Desktop/LifeOS/frontend/src/pages/TasksPage.jsx';
let content = fs.readFileSync(file, 'utf8');

// Normalize line endings to LF for consistent replacing
content = content.replace(/\r\n/g, '\n');

// 1. imports and useToast
if (!content.includes('useToast')) {
    content = content.replace(
        'import { buildTaskStatusOptions, normalizeTaskStatus } from "../utils/taskStatus";',
        'import { buildTaskStatusOptions, normalizeTaskStatus } from "../utils/taskStatus";\nimport { useToast } from "../components/ui/ToastProvider";'
    );
}

if (!content.includes('const { showToast } = useToast();')) {
    content = content.replace(
        '  const isFullscreen = Boolean(detailRouteTaskId);',
        '  const isFullscreen = Boolean(detailRouteTaskId);\n  const { showToast } = useToast();'
    );
}

// 2. handleCreateTask
content = content.replace(
    /const handleCreateTask = async \(payload\) => \{[\s\S]*?finally \{\n\s*setCreatingTask\(false\);\n\s*\}\n\s*\};/,
    `const handleCreateTask = async (payload) => {
    setIsCreateOpen(false);
    setCreateTaskError("");
    
    const tempId = \`temp-\${Date.now()}\`;
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
  };`
);

// 3. handleSaveTask
content = content.replace(
    /const handleSaveTask = async \(payload\) => \{[\s\S]*?finally \{\n\s*setSavingTask\(false\);\n\s*\}\n\s*\};/,
    `const handleSaveTask = async (payload) => {
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
  };`
);

// 4. handleStatusChange
content = content.replace(
    /const handleStatusChange = async \(nextStatus\) => \{[\s\S]*?finally \{\n\s*setStatusUpdatingTask\(false\);\n\s*\}\n\s*\};/,
    `const handleStatusChange = async (nextStatus) => {
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
  };`
);

// 5. handleDeleteTask
content = content.replace(
    /const handleDeleteTask = async \(\) => \{[\s\S]*?finally \{\n\s*setDeletingTask\(false\);\n\s*\}\n\s*\};/,
    `const handleDeleteTask = async () => {
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
  };`
);

// 6. handleLabelChange
content = content.replace(
    /const handleLabelChange = async \(nextLabelId\) => \{[\s\S]*?finally \{\n\s*setStatusUpdatingTask\(false\);\n\s*\}\n\s*\};/,
    `const handleLabelChange = async (nextLabelId) => {
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
  };`
);

fs.writeFileSync(file, content);
console.log("TasksPage optimistic UI applied.");
