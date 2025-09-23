import { Link, useNavigate } from 'react-router-dom';
import s from './Header.module.scss';

export const Header = () => {
  const navigate = useNavigate();

  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
  const role = sessionStorage.getItem('role') || '';

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <header className={s.header}>
      <h1>Панель Адміністратора</h1>

      {isLoggedIn && role && (
        <div className={s.userInfo}>
          <span>{role}</span>
          <button onClick={handleLogout} className={s.logoutBtn}>
            Вийти
          </button>
        </div>
      )}{!isLoggedIn && (
        <div className={s.userInfo}>
          <Link to={"/login"} onClick={handleLogout} className={s.logoutBtn}>
            Увійти в систему
          </Link>
        </div>
      )}
    </header>
  );
};
