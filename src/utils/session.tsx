export async function save(key: string, value: string): Promise<void> {
    try {
        sessionStorage.setItem(key, value);
    } catch (error) {
        console.error(`Error saving to sessionStorage: ${error}`);
    }
}

export async function getValueFor(key: string): Promise<string | null> {
    try {
        return sessionStorage.getItem(key);
    } catch (error) {
        console.error(`Error fetching from sessionStorage: ${error}`);
        return null;
    }
}

export async function deleteValueFor(key: string): Promise<void> {
    try {
        sessionStorage.removeItem(key);
    } catch (error) {
        console.error(`Error deleting from sessionStorage: ${error}`);
    }
}
