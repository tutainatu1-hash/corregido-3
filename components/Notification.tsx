
import React from 'react';

interface NotificationProps {
    show: boolean;
    message: string;
}

const Notification: React.FC<NotificationProps> = ({ show, message }) => {
    return (
        <div 
            className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        bg-slate-700 text-white text-lg font-semibold 
                        px-8 py-4 rounded-lg shadow-2xl
                        transition-opacity duration-300 ease-in-out
                        ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
            {message}
        </div>
    );
};

export default Notification;
