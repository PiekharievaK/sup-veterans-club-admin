import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import s from "./ProgramsPage.module.scss";
import { fetchJson } from "../../helpers/fetchData";
import { Loader } from "../../components/Loader/Loader";
import type { ProgramData } from "../../types/programs";
import SCHEDULE_OPTIONS from '../../data/scheduleOptions.json';

export const ProgramsPage = () => {
  const [loading, setLoading] = useState(false);
  const [programs, setPrograms] = useState<ProgramData[]>([]);
  const navigate = useNavigate();

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

  const handleDelete = (id: string) => {
    const confirmed = window.confirm("Ви дійсно хочете видалити цю програму?");
    if (confirmed) {
      setPrograms((prevPrograms) =>
        prevPrograms.filter((program) => program.id !== id)
      );
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
                <button onClick={() => handleEdit(program.id)}>Редагувати</button>
                <button onClick={() => handleDelete(program.id)}>Видалити</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {loading && <Loader />}

      <div className={s.createNewButtonContainer}>
        <button onClick={handleCreateNew} className={s.createNewButton}>
          + Створити нову програму
        </button>
      </div>
    </div>
  );
};
