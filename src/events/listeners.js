const taskEvents = require('./events');

/**
 * 1. Error Event Listener (Supplementary Problem 2)
 * Must be registered BEFORE any event emitter calls can emit an error event.
 * Catches and logs errors occurring inside background event handlers without crashing the server.
 * Avoids uncaught exception terminations and prevents recursive error emission.
 */
taskEvents.on('error', (error) => {
    try {
        const timestamp = new Date().toISOString();
        const errorMessage = error && error.message ? error.message : String(error);
        const errorDetails = error && error.stack ? error.stack : errorMessage;

        console.error(`[Notification Error] Failed to process task-created notification`);
        console.error(`Error details: ${errorDetails}`);
        console.error(`[Notification Error] Logged at: ${timestamp}`);

        // Emit safe internal hook for testing without triggering 'error' loops
        taskEvents.emit('notification-error-logged', {
            message: errorMessage,
            details: errorDetails,
            timestamp
        });
    } catch (err) {
        console.error('[Notification Error] Fatal logging failure in error handler:', err.message);
    }
});

/**
 * 2. task-created Event Listener
 * Executes asynchronously using setImmediate() and setTimeout(..., 2000)
 * to simulate a 2-second background notification without blocking the HTTP response.
 */
taskEvents.on('task-created', (task, user) => {
    const scheduledAt = new Date().toISOString();
    console.log(`[Notification] Handler scheduled at: ${scheduledAt}`);

    // Defer execution from current call stack to next iteration of Event Loop
    setImmediate(() => {
        try {
            const startTime = new Date().toISOString();
            console.log(`[Notification] Handler started at: ${startTime}`);

            // Controlled failure hook for Supplementary Problem 2 testing
            if (taskEvents.simulateNotificationError || (task && task.title && task.title.includes("[SIMULATE_ERROR]"))) {
                throw new Error("Simulated notification service failure: network timeout connecting to notification gateway");
            }

            const assignedUser = user && (user.id || user._id || user.email)
                ? (user.id || user._id || user.email)
                : (task && task.user ? task.user : 'Unassigned');

            console.log(`[Notification] Task "${task.title}" assigned to user "${assignedUser}"`);

            // Simulate slow 2-second notification processing
            setTimeout(() => {
                try {
                    const completedAt = new Date().toISOString();
                    console.log(`[Notification] Handler completed at: ${completedAt}`);

                    // Emit internal completion event for monitoring and automated testing
                    taskEvents.emit('notification-completed', {
                        task,
                        assignedUser,
                        scheduledAt,
                        startedAt: startTime,
                        completedAt
                    });
                } catch (timeoutErr) {
                    taskEvents.emit('error', timeoutErr);
                }
            }, 2000);
        } catch (immediateErr) {
            taskEvents.emit('error', immediateErr);
        }
    });
});

/**
 * 3. task-deleted Event Listener (Supplementary Problem 1)
 * Non-blocking task deletion notification deferred using setImmediate().
 * Logs Task title, Task ID, deletion timestamp, and assigned user.
 */
taskEvents.on('task-deleted', (task, user) => {
    const scheduledAt = new Date().toISOString();
    console.log(`[Notification] Handler scheduled at: ${scheduledAt}`);

    setImmediate(() => {
        try {
            const timestamp = new Date().toISOString();
            const taskId = task && (task._id ? task._id.toString() : (task.id || 'Unknown ID'));
            const title = task && task.title ? task.title : 'Untitled Task';
            const assignedUser = user && (user.id || user._id || user.email)
                ? (user.id || user._id || user.email)
                : (task && task.user ? task.user : 'Unassigned');

            console.log(`[Notification] Task "${title}" deleted at ${timestamp}`);
            console.log(`[Notification] Task ID: ${taskId}`);
            console.log(`[Notification] Deleted task assigned user: "${assignedUser}"`);

            // Emit internal completion event for monitoring and automated testing
            taskEvents.emit('task-deleted-processed', {
                task,
                taskId,
                assignedUser,
                deletedAt: timestamp
            });
        } catch (error) {
            taskEvents.emit('error', error);
        }
    });
});

module.exports = taskEvents;
