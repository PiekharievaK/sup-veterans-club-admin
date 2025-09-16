export const generateUniqueId = (existingIds: Set<string>): string => {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    let id = '';
    do {
        id = Array.from({ length: 6 }, () =>
            characters[Math.floor(Math.random() * characters.length)]
        ).join('');
    } while (existingIds.has(id));

    return id;
};
