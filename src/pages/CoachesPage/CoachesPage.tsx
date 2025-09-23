import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Instructor } from "../../types/coach";
import { fetchJson } from "../../helpers/fetchData";
import { saveJsonFile } from "../../helpers/updateData";
import s from "./CoachesPage.module.scss";
import { useLoader } from "../../helpers/LoaderHook";
import { PermissionWrapper } from "../../components/PermissionWrapper/PermissionWrapper";


export const CoachesListPage = () => {
    const [coaches, setCoaches] = useState<Instructor[]>([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { setLoading } = useLoader();

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            try {
                const data = await fetchJson<Instructor[]>("coaches.json");
                setCoaches(data);
            } catch {
                setError("Не вдалося завантажити список тренерів");
            } finally {
                setLoading(false)
            }
        };
        load();
    }, []);

    const handleDelete = async (id: string) => {
        const confirmed = window.confirm("Ви впевнені, що хочете видалити цього тренера?");
        if (!confirmed) return;

        const updated = coaches.filter((coach) => coach.id !== id);
        setCoaches(updated);
        setLoading(true)
        try {
            await saveJsonFile("coaches.json", updated);
        } catch (err) {
            console.error("Error saving after deletion:", err);
            alert("Сталася помилка при збереженні змін.");
        } finally {
            setLoading(false)
        }
    };

    if (error) return <p>{error}</p>;

    return (
        <div className={s.CoachesListPage}>
            <div className={s.header}>
                <h2>Список тренерів</h2>
                <PermissionWrapper>
                    <button className={s.addBtn} onClick={() => navigate("/coaches/new")}>
                        ➕ Додати тренера
                    </button>
                </PermissionWrapper>
            </div>

            <div className={s.grid}>
                {coaches.map((coach) => (
                    <div key={coach.id} className={s.card}>
                        <img src={coach.photo[0]} alt={coach.ua.name} />
                        <h3>{coach.ua.name}</h3>
                        <p>{coach.ua.role}</p>
                        <div className={s.actions}>
                            <PermissionWrapper>
                                <button className={s.change} onClick={() => navigate(`/coaches/${coach.id}`)}>Редагувати</button>
                            </PermissionWrapper>
                            <PermissionWrapper>
                                <button onClick={() => handleDelete(coach.id) } className={s.delete}>Видалити</button>
                            </PermissionWrapper>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
