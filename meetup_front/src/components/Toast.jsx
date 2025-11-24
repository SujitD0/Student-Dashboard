import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const icons = {
        success: <CheckCircle className="w-5 h-5" />,
        error: <AlertCircle className="w-5 h-5" />,
        info: <Info className="w-5 h-5" />
    };

    const colors = {
        success: 'bg-green-500 border-green-700',
        error: 'bg-red-500 border-red-700',
        info: 'bg-blue-500 border-blue-700'
    };

    return (
        <div className={`fixed top-4 right-4 z-50 ${colors[type]} text-white px-4 py-3 rounded border-2 shadow-hard flex items-center gap-3 min-w-[300px] max-w-md`}>
            {icons[type]}
            <p className="flex-1 font-medium">{message}</p>
            <button onClick={onClose} className="hover:bg-white/20 p-1 rounded">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Toast;
