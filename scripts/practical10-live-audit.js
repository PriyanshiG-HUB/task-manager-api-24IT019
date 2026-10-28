const jwt = require("c:/Users/priya/Downloads/task-manager-api/node_modules/jsonwebtoken");

const BASE_URL = "http://localhost:5000/api/v1";
const JWT_SECRET = process.env.JWT_SECRET || "task_manager_practical7_secret_2026";

async function runLiveAudit() {
    console.log("=== STARTING LIVE RUNTIME AUDIT ON HTTP://LOCALHOST:5000 ===");

    // 1. Health check
    console.log("\n--- STEP 1: Health Check ---");
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    console.log(`Health Status: ${healthRes.status}`, healthData);

    // 2. Auth token generation
    const token = jwt.sign(
        { id: "audit_user_24IT019", email: "audit_tester@charusat.edu.in" },
        JWT_SECRET,
        { expiresIn: "1h" }
    );
    console.log(`Generated JWT for user audit_user_24IT019`);

    // 3. Cache Stats initial
    console.log("\n--- STEP 2: Cache Initial Stats ---");
    const cacheInitRes = await fetch(`${BASE_URL}/cache/stats`);
    console.log("Cache Stats:", await cacheInitRes.json());

    // 4. Task Creation with timing
    console.log("\n--- STEP 3: Task Creation & Timing ---");
    const createPayload = {
        title: "Practical 10 Audit Live Task - " + Date.now(),
        description: "Live runtime demonstration of asynchronous event processing",
        priority: "high"
    };

    const clientDispatchTime = Date.now();
    console.log(`Client dispatching POST /api/v1/tasks at: ${new Date(clientDispatchTime).toISOString()}`);

    const createRes = await fetch(`${BASE_URL}/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(createPayload)
    });

    const clientResponseReceivedTime = Date.now();
    const createData = await createRes.json();
    const roundTripLatency = clientResponseReceivedTime - clientDispatchTime;

    console.log(`Client received response at: ${new Date(clientResponseReceivedTime).toISOString()}`);
    console.log(`Round-trip HTTP response latency: ${roundTripLatency}ms`);
    console.log(`HTTP Status: ${createRes.status}`);
    console.log("Response Body:", JSON.stringify(createData, null, 2));

    const taskId = createData.data._id;

    // 5. Wait 2.5 seconds to observe delayed notification in server logs
    console.log("\nWaiting 2.5 seconds for background notification completion...");
    await new Promise(r => setTimeout(r, 2500));

    // 6. Delete Task
    console.log("\n--- STEP 4: Task Deletion Event ---");
    const deleteDispatchTime = Date.now();
    console.log(`Client dispatching DELETE /api/v1/tasks/${taskId} at: ${new Date(deleteDispatchTime).toISOString()}`);

    const deleteRes = await fetch(`${BASE_URL}/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    const deleteData = await deleteRes.json();
    console.log(`Delete HTTP Status: ${deleteRes.status}`);
    console.log("Delete Response Body:", JSON.stringify(deleteData, null, 2));

    await new Promise(r => setTimeout(r, 500));

    // 7. Negative Deletion (Non-existent task)
    console.log("\n--- STEP 5: Negative Deletion (Non-existent task) ---");
    const fakeId = "661234567890123456789012";
    const negDeleteRes = await fetch(`${BASE_URL}/tasks/${fakeId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    const negDeleteData = await negDeleteRes.json();
    console.log(`Negative Delete HTTP Status: ${negDeleteRes.status}`);
    console.log("Negative Delete Response Body:", JSON.stringify(negDeleteData, null, 2));

    // 8. Controlled Error Simulation
    console.log("\n--- STEP 6: Controlled Error Simulation ---");
    const errorPayload = {
        title: "Controlled Error Audit Task [SIMULATE_ERROR] - " + Date.now(),
        description: "Triggering controlled simulated background notification failure",
        priority: "medium"
    };

    const errDispatch = Date.now();
    const errRes = await fetch(`${BASE_URL}/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(errorPayload)
    });
    const errLatency = Date.now() - errDispatch;
    const errData = await errRes.json();
    console.log(`Simulated Error Task HTTP Status: ${errRes.status} (received in ${errLatency}ms)`);
    console.log("Response Body:", JSON.stringify(errData, null, 2));

    await new Promise(r => setTimeout(r, 500));

    // 9. Health Check After Error (Server survivability)
    console.log("\n--- STEP 7: Server Survivability Check After Error ---");
    const healthPostErr = await fetch(`${BASE_URL}/health`);
    const healthPostErrData = await healthPostErr.json();
    console.log(`Post-error Health HTTP Status: ${healthPostErr.status}`);
    console.log("Post-error Health Data:", healthPostErrData);

    // Clean up created error task
    if (errData.data && errData.data._id) {
        await fetch(`${BASE_URL}/tasks/${errData.data._id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
    }

    console.log("\n=== LIVE RUNTIME AUDIT COMPLETE ===");
}

runLiveAudit().catch(console.error);
