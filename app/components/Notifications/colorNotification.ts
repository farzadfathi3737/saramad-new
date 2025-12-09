import Swal from 'sweetalert2';

export const ColoredToast = (color: string, message: string) => {
    const colorMap: Record<string, string> = {
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6',
        secondary: '#6b7280',
        primary: '#2ab0aa',
    };

    const toast = Swal.mixin({
        toast: true,
        position: 'top-start',
        showConfirmButton: false,
        timer: 3000,
        showCloseButton: true,
        background: colorMap[color] || colorMap.info,
        color: '#ffffff',
        iconColor: '#ffffff',
    });

    toast.fire({
        title: message,
        icon: color === 'success' ? 'success' : color === 'danger' ? 'error' : color === 'warning' ? 'warning' : 'info',
    });
};