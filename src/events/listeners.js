const taskEvents = require('./events');

taskEvents.on('task-created', (task, user) => {
    console.log(`[Notification] Handler scheduled at: ${new Date().toISOString()}`);
    
    setImmediate(() => {
        try {
            const startTime = new Date().toISOString();
            console.log(`[Notification] Handler started at: ${startTime}`);
            
            const assignedUser = user && user.id ? user.id : 'Unassigned';
            console.log(`[Notification] Task "${task.title}" assigned to user "${assignedUser}"`);

            setTimeout(() => {
                console.log(`[Notification] Handler completed at: ${new Date().toISOString()}`);
            }, 2000);
        } catch (error) {
            taskEvents.emit('error', error);
        }
    });
});

taskEvents.on('task-deleted', (task) => {
    setImmediate(() => {
        try {
            console.log(`[Notification] Task "${task.title}" deleted at ${new Date().toISOString()}`);
        } catch (error) {
            taskEvents.emit('error', error);
        }
    });
});

taskEvents.on('error', (error) => {
    console.error(`[Event Error] ${error.message}`);
});
