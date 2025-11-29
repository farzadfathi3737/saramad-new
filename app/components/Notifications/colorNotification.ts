import Swal from 'sweetalert2';

export const ColoredToast = (color: string, message: string) => {
    const toast = Swal.mixin({
        toast: true,
        position: 'top-start',
        showConfirmButton: false,
        timer: 3000,
        showCloseButton: true,
        customClass: {
            popup: `color-${color}`, // info, warning, danger, success, secendary, primery
        },
    });
    toast.fire({
        title: message,
    });
};