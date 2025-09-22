import s from "./Loader.module.scss";
import { useLoader } from "../../helpers/LoaderHook";

export const Loader = () => {
    const { isLoading } = useLoader();

    if (!isLoading) return null;

    return (
        <div className={s.loaderBox}>
            <div className={s.loader}></div>
        </div>
    );
};


