import { useState, useEffect } from 'react';
import { getActivityInsights } from '../services/activityInsightsService';

export const useActivityInsights = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        
        const fetchInsights = async () => {
            try {
                setLoading(true);
                const insightsData = await getActivityInsights();
                
                console.log("INSIGHTS PAYLOAD:", insightsData);
                
                if (mounted) {
                    setData(insightsData);
                    setError(null);
                }
            } catch (err) {
                if (mounted) {
                    setError(err.response?.data?.message || 'Failed to load activity insights');
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchInsights();

        return () => {
            mounted = false;
        };
    }, []);

    return { data, loading, error };
};
