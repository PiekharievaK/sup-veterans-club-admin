import s from "./Loader.module.scss"

export const Loader = () => {
    return <div className={s.loaderBox}>
        <div className={s.loader}></div>
    </div>
}