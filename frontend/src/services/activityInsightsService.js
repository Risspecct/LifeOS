import axiosClient from '../api/axiosClient';

export const getActivityInsights = async () => {
    try {
        const response = await axiosClient.get('/insights');
        console.log("RAW INSIGHTS RESPONSE:", response);
        console.log("RAW INSIGHTS DATA:", response.data);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch activity insights:", error);
        throw error;
    }
};
