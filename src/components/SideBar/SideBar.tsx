import { NavLink } from "react-router-dom"
import s from './SideBar.module.scss'

export const SideBar = () => {
    return (

        <nav className={s.nav}>
            <NavLink to={'/schedule'} className={s.navItem}>Розклад</NavLink>
            <NavLink to={'/coaches'} className={s.navItem}>Тренери</NavLink>
            <NavLink to={'/events'} className={s.navItem}>Заходи</NavLink>
            <NavLink to={'/partners'} className={s.navItem}>Партнери</NavLink>
            <NavLink to={'/donations'} className={s.navItem}>Дружні збори</NavLink>
            <NavLink to={'/contacts'} className={s.navItem}>Контакти</NavLink>
            <NavLink to={'/programs'} className={s.navItem}>Програми</NavLink>
        </nav>

    )
}