import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import s from './LoginPage.module.scss';

const login1 = import.meta.env.VITE_LOGIN_1;
const password1 = import.meta.env.VITE_PASSWORD_1;
const role1 = import.meta.env.VITE_ROLE_1;

const login2 = import.meta.env.VITE_LOGIN_2;
const password2 = import.meta.env.VITE_PASSWORD_2;
const role2 = import.meta.env.VITE_ROLE_2;

const login3 = import.meta.env.VITE_LOGIN_3;
const password3 = import.meta.env.VITE_PASSWORD_3;
const role3 = import.meta.env.VITE_ROLE_3;

export const LoginPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

console.log(username, password)


 if (
            (username === login1 && password !== password1) ||
            (username === login2 && password !== password2) ||
            (username === login3 && password !== password3)
        ){
            alert("Невірні логін або пароль")
            return
        }
        if (
            (username === login1 && password === password1) ||
            (username === login2 && password === password2) ||
            (username === login3 && password === password3)
        ) {
            sessionStorage.setItem('isLoggedIn', 'true');

            if (username === login1 && password === password1) {
                sessionStorage.setItem('role', role1);
               
            } else if
                (username === login2 && password === password2) {
                sessionStorage.setItem('role', role2);
            }
            else if (username === login3 && password === password3) {
                sessionStorage.setItem('role', role3);

            }
             navigate('/schedule');
        } else {
            setError('Невірний логін або пароль');
        }
    };

    return (
        <div className={s.loginPage}>
            <h2 className={s.title}>Вхід</h2>

            {error && <div className={s.error}>{error}</div>}

            <form onSubmit={handleSubmit} className={s.form}>
                <div className={s.inputField}>
                    <label htmlFor="username" className={s.label}>
                        Логін
                    </label>
                    <input
                        type="text"
                        id="username"
                        className={s.input}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className={s.inputField}>
                    <label htmlFor="password" className={s.label}>
                        Пароль
                    </label>
                    <input
                        type="password"
                        id="password"
                        className={s.input}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className={s.loginBtn}>
                    Увійти
                </button>
            </form>
        </div>
    );
};
