const taskEvents = require('./events');

/**
 * 1. Error Event Listener
 * Must be registered BEFORE any event emitter calls can emit an error event.
 * Avoids uncaught exception terminations and prevents recursive error emission.
 */
taskEvents.on('error', (error) => {
    try {
        console.error(`[Event Error] ${error && error.message ? error.message : error}`);
    } catch (err) {
        console.error('[Event Error] Failed to handle event error:', err);
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
 * 3. task-deleted Event Listener
 * Non-blocking task deletion notification deferred using setImmediate().
 */
taskEvents.on('task-deleted', (task, user) => {
    const scheduledAt = new Date().toISOString();
    console.log(`[Notification] Handler scheduled at: ${scheduledAt}`);

    setImmediate(() => {
        try {
            const timestamp = new Date().toISOString();
            const assignedUser = user && (user.id || user._id || user.email)
                ? (user.id || user._id || user.email)
                : (task && task.user ? task.user : 'Unassigned');

            console.log(`[Notification] Task "${task.title}" deleted at ${timestamp}`);
            console.log(`[Notification] Deleted task assigned user: "${assignedUser}"`);

            // Emit internal completion event for monitoring and automated testing
            taskEvents.emit('task-deleted-processed', {
                task,
                assignedUser,
                deletedAt: timestamp
            });
        } catch (error) {
            taskEvents.emit('error', error);
        }
    });
});

module.exports = taskEvents;
