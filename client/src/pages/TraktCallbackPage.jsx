import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import integrationService from '../../services/integrationService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function TraktCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { refreshUser } = useAuth();
    const [status, setStatus] = useState('Processing...');

    useEffect(() => {
        const code = searchParams.get('code');
        if (!code) {
            toast.error('No authorization code found');
            navigate('/settings/integrations');
            return;
        }

        const connect = async () => {
            try {
                await integrationService.connectTrakt(code);
                await refreshUser();
                toast.success('Successfully connected to Trakt!');
                navigate('/settings/integrations');
            } catch (error) {
                setStatus('Failed');
                toast.error('Connection failed: ' + error.message);
                setTimeout(() => navigate('/settings/integrations'), 2000);
            }
        };

        connect();
    }, [searchParams, navigate, refreshUser]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
            <h2 className="text-xl font-semibold dark:text-white">{status}</h2>
            <p className="text-gray-500">Finishing up Trakt connection...</p>
        </div>
    );
}
