import React from 'react';
import s from './PermissionWrapper.module.scss'

const getUserRole = () => {
    try {
        return sessionStorage.getItem('role') || 'guest';
    } catch {
        return 'guest';
    }
};

const canEdit = () => {
    const role = getUserRole();
    return role === 'admin';
};

export const PermissionWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const allowed = canEdit();
    const handleClick = (e: React.MouseEvent) => {
        console.log(allowed)
        if (!allowed) {
            e.preventDefault();
            e.stopPropagation();
            alert('У вас обмежені права нацю дію, дія тільки для адміністратора');
            return
        }
    };

    return (
        <div className={`${s.permissionWrapper} ${allowed ? s.allowed : s.blocked}`} onClick={handleClick}>
            {children}
        </div>
    );
};
