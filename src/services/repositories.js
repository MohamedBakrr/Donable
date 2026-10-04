const read = (key, fallback) => {
    try {
        const value = localStorage.getItem(`donable:${key}`);
        return value ? JSON.parse(value) : fallback;
    } catch (error) {
        console.error(
            `Unable to read Donable ${key} from local storage.`,
            error,
        );
        return fallback;
    }
};

const write = (key, value) => {
    try {
        localStorage.setItem(`donable:${key}`, JSON.stringify(value));
    } catch (error) {
        console.error(`Unable to save Donable ${key} to local storage.`, error);
    }
};

const legacyDemoRecordIds = {
    tasks: new Set(["task-1", "task-2", "task-3", "task-4", "task-5", "task-6"]),
    habits: new Set(["habit-1", "habit-2", "habit-3"]),
    notifications: new Set([
        "notification-1",
        "notification-2",
        "notification-3",
    ]),
    activity: new Set(["activity-1", "activity-2", "activity-3"]),
};

const collectionRepository = (key) => ({
    getAll: () => {
        const records = read(key, []);
        const demoIds = legacyDemoRecordIds[key];
        if (!Array.isArray(records) || !demoIds) return records;

        const userRecords = records.filter((record) => !demoIds.has(record.id));
        if (userRecords.length !== records.length) write(key, userRecords);
        return userRecords;
    },
    saveAll: (records) => write(key, records),
});

export const taskRepository = collectionRepository("tasks");
export const habitRepository = collectionRepository("habits");
export const notificationRepository = collectionRepository("notifications");
export const activityRepository = collectionRepository("activity");

export const settingsRepository = {
    get: () => ({
        theme: "system",
        focusMinutes: 25,
        breakMinutes: 5,
        soundEnabled: true,
        browserNotificationsEnabled: false,
        ...read("settings", {}),
    }),
    save: (settings) => write("settings", settings),
};

export const timerRepository = {
    get: () =>
        read("timer", {
            status: "idle",
            remainingSeconds: 25 * 60,
            sessionType: "focus",
            taskId: "",
        }),
    save: (timer) => write("timer", timer),
};

export const userRepository = {
    get: () => read("user", null),
    save: (user) => write("user", user),
    clear: () => localStorage.removeItem("donable:user"),
};
