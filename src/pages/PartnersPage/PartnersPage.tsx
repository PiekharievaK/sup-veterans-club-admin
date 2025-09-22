import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import s from "./PartnersPage.module.scss";
import { fetchJson } from "../../helpers/fetchData";
import { saveJsonFile } from "../../helpers/updateData";
import { useLoader } from "../../helpers/LoaderHook";


export type Contact = {
  title: string;
  url: string;
};

export type LocalizedPartnerData = {
  name: string;
  description: string;
};

export type Partner = {
  id: string;
  image: string;
  contacts: Contact[];
  ua: LocalizedPartnerData;
  en: LocalizedPartnerData;
};

export const PartnersPage = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { setLoading } = useLoader();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchJson<Partner[]>("partners.json");
        setPartners(data);
      } catch {
        setError("Не вдалося завантажити партнерів");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Ви впевнені, що хочете видалити цього партнера?")) return;

    const updated = partners.filter((p) => p.id !== id);
    setPartners(updated);

    setLoading(true);
    try {
      await saveJsonFile("partners.json", updated);
    } catch (err) {
      console.error(err);
      alert("Помилка при збереженні");
    } finally {
      setLoading(false);
    }
  };

  if (error) return <p>{error}</p>;

  return (
    <div className={s.PartnersListPage}>
      <div className={s.header}>
        <h2>Партнери</h2>
        <button onClick={() => navigate("/partners/new")} className={s.addBtn}>
          ➕ Додати партнера
        </button>
      </div>

      <div className={s.grid}>
        {partners.map((partner) => (
          <div key={partner.id} className={s.card}>
            <img src={partner.image} alt={partner.ua.name} />
            <h3>{partner.ua.name}</h3>
            <p>{partner.ua.description}</p>
            <div className={s.actions}>
              <button onClick={() => navigate(`/partners/${partner.id}`)}>Редагувати</button>
              <button onClick={() => handleDelete(partner.id)}>Видалити</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
