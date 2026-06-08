'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';

export function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        const res = await fetch('/api/auth/logout', { method: 'POST' });
        if (res.ok) {
            toast.success('Logged out');
            router.push('/login');
            router.refresh();
        }
    };

    return (
        <button onClick={handleLogout} className="flex items-center gap-2">
            <LogOut size={18} />
            Logout
        </button>
    );
}