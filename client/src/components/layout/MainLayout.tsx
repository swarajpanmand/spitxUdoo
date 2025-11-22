import React from 'react';
import type { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Header } from './Header';
import { Toast } from '../ui/Toast';
import './MainLayout.css';

interface MainLayoutProps {
    children: ReactNode;
    title: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, title }) => {
    const [toasts, setToasts] = React.useState<Array<{ id: string; type: 'success' | 'error' | 'info' | 'warning'; message: string }>>([]);

    const addToast = (type: 'success' | 'error' | 'info' | 'warning', message: string) => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, type, message }]);
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    React.useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key.toLowerCase() === 'q') {
                const stockMessages = [
                    'New Stock Received: 50x Steel Rods',
                    'New Stock Received: 200x Copper Wire',
                    'New Stock Received: 100x Aluminum Sheets',
                    'New Stock Received: 75x Iron Bars',
                    'New Stock Received: 30x Plastic Pellets',
                    'New Stock Received: 500x Screws (M4)',
                    'New Stock Received: 150x Wooden Planks'
                ];
                const randomMessage = stockMessages[Math.floor(Math.random() * stockMessages.length)];
                addToast('info', randomMessage);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

    return (
        <div className="main-layout">
            <Navbar />
            <div className="main-content">
                <Header title={title} />
                <main className="main-body">{children}</main>
            </div>
            <div className="toast-container">
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        id={toast.id}
                        type={toast.type}
                        message={toast.message}
                        onClose={removeToast}
                    />
                ))}
            </div>
        </div>
    );
};
