import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import s from "./ProgramsPage.module.scss";
import { fetchJson } from "../../helpers/fetchData";
import { saveJsonFile } from "../../helpers/updateData";
import type { ProgramData } from "../../types/programs";
import { useLoader } from "../../helpers/LoaderHook";
import SCHEDULE_OPTIONS from '../../data/scheduleOptions.json';
import { PermissionWrapper } from "../../components/PermissionWrapper/PermissionWrapper";


export const ProgramsPage = () => {
    const [programs, setPrograms] = useState<ProgramData[]>([]);
    const navigate = useNavigate();

    const { setLoading } = useLoader();

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            try {
                const fetchedData = await fetchJson<ProgramData[]>("programs.json");
                setPrograms(fetchedData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, []);

    const handleEdit = (id: string) => {
        navigate(`/programs/${id}`);
    };

    const handleDelete = async (id: string) => {
        const confirmed = window.confirm("Ви дійсно хочете видалити цю програму?");
        if (confirmed) {

            const updatedPrograms = programs.filter((program) => program.id !== id);


            setPrograms(updatedPrograms);

            try {
                setLoading(true);


                await saveJsonFile("programs.json", updatedPrograms);

                alert("Збережено");
            } catch {
                alert("Щось пішло не так. Не збережено");
            } finally {
                setLoading(false);
            }
        }
    };


    const handleCreateNew = () => {
        navigate(`/programs/new`);
    };

    return (
        <div className={s.programPage}>
            <div className={s.programsGrid}>
                {programs.map((program) => (
                    <div key={program.id} className={s.programCard}>
                        <div className={s.programDetails}>
                            <h3>{program.ua.title}</h3>

                            <p>
                                <strong>Розклад: </strong>
                                {SCHEDULE_OPTIONS.find((item) => item.id === program.schedule)?.ua}
                            </p>

                            <div className={s.programActions}>
                                <PermissionWrapper>
                                    <button className={s.change} onClick={() => handleEdit(program.id)}>Редагувати</button>
                                </PermissionWrapper>
                                <PermissionWrapper>
                                    <button className={s.delete} onClick={() => handleDelete(program.id)}>Видалити</button>
                                </PermissionWrapper>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className={s.createNewButtonContainer}>
                <PermissionWrapper>
                    <button onClick={handleCreateNew} className={s.createNewButton}>
                        + Створити нову програму
                    </button>
                </PermissionWrapper>
            </div>
        </div>
    );
};
