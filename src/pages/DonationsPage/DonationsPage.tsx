import { useEffect, useState } from "react";
import { DonationModal } from "../../components/DonationModal/DonationModal";
import { fetchJson } from "../../helpers/fetchData";
import { saveJsonFile } from "../../helpers/updateData";
import s from "./DonationsPage.module.scss";
import type { Donation } from "../../types/donates";
import { generateUniqueId } from "../../helpers/createId";
import { Loader } from "../../components/Loader/Loader";

export const DonationsPage = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [editing, setEditing] = useState<Donation | undefined>(undefined);
  const [loading, setLoading] = useState(false);


  useEffect(() => {

    const getData = async () => {
      setLoading(true)
      try {

        await fetchJson<Donation[]>("donations.json").then(setDonations);
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    getData()
  }, []);

  const handleSave = async (updatedDonation: Donation) => {
    const existingIds = new Set(donations.map((d) => d.id));

    const updated = {
      ...updatedDonation,
      id: updatedDonation.id || generateUniqueId(existingIds),
    };

    const exists = donations.find((d) => d.id === updated.id);
    const newList = exists
      ? donations.map((d) => (d.id === updated.id ? updated : d))
      : [...donations, updated];

    setDonations(newList);
    setEditing(undefined);
    await saveJsonFile("donations.json", newList);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Ви впевнені, що хочете видалити?");
    if (!confirmed) return;

    const newList = donations.filter((d) => d.id !== id);
    setDonations(newList);
    await saveJsonFile("donations.json", newList);
  };

  const handleCreateNew = () => {
    setEditing({
      id: "",
      icon: "",
      url: "",
      ua: { title: "", summary: "" },
      en: { title: "", summary: "" },
    });
  };

  return (
    <div className={s.page}>
      <div className={s.header}>
        <h1>Донати</h1>
        <button className={s.newButton} onClick={handleCreateNew}>
          + Новий донат
        </button>
      </div>

      <ul className={s.list}>
        {donations.map((d) => (
          <li key={d.id} className={s.item}>
            <svg className={s.icon}>
              <use xlinkHref={`#${d.icon}`} />
            </svg>
            <div className={s.text}>
              <strong className={s.title}>{d.ua.title}</strong>
              <p className={s.summary}>{d.ua.summary}</p>
            </div>
            <div className={s.actions}>
              <button className={s.edit} onClick={() => { setEditing(d); }}>
                Редагувати
              </button>
              <button className={s.delete} onClick={() => handleDelete(d.id)}>
                Видалити
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editing !== undefined && (
        <DonationModal
          donation={editing}
          onClose={() => setEditing(undefined)}
          onSave={handleSave}
        />
      )}
      {loading && <Loader />}
    </div>
  );
};
