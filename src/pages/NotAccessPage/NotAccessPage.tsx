import s from './NotAccessPage.module.scss'

export const NotAccessPage = () => {
    return <div className={s.container}>
        <img className={s.image} src="https://cdn-icons-png.flaticon.com/512/3380/3380493.png" alt="404" />

        <h4>
            Oopps! У вашого користувача немає доступу до взаємодвї з цією сторінкою.
        </h4>

        <p>
            {"Доступна строінка:  "}
            <a href="/schedule" className={s.link}>
                розклад
            </a>
        </p>

    </div>
}