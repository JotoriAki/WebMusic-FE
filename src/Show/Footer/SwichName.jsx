import { getUserByEmail } from "../../Actions/UserAction";


export const switchUserName = async (email) => {
    try {
        const res = await getUserByEmail(email);
        return res?.username || 'Unknown User';
    } catch (error) {
        console.error(`Error fetching username for ${email}:`, error);
        return 'Unknown User';
    }
};
