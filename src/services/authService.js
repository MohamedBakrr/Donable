import { userRepository } from "./repositories";

export const authService = {
    getCurrentUser: () => userRepository.get(),
    login: ({ name, email }) => {
        const user = {
            id: `user-${Date.now()}`,
            name: name?.trim() || email.split("@")[0],
            email: email.trim(),
            avatar: "",
        };
        userRepository.save(user);
        return user;
    },
    logout: () => userRepository.clear(),
};
