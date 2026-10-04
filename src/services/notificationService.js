export const notificationService = {
    create: (type, title, message) => ({
        id: `notification-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        type,
        title,
        message,
        createdAt: new Date().toISOString(),
        read: false,
    }),
    permission: () => {
        if (!("Notification" in window)) return "unsupported";
        return Notification.permission;
    },
    requestPermission: async () => {
        if (!("Notification" in window)) return "unsupported";
        return Notification.requestPermission();
    },
    sendBrowserNotification: (notification) => {
        if (
            !("Notification" in window) ||
            Notification.permission !== "granted"
        )
            return false;
        try {
            new Notification(notification.title, {
                body: notification.message,
                icon: "/favicon.svg",
                tag: notification.id,
            });
            return true;
        } catch (error) {
            console.error(
                "Unable to show a Donable browser notification.",
                error,
            );
            return false;
        }
    },
};
