import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Instructor, LocalizedCoachData } from "../../types/coach";
import { fetchJson } from "../../helpers/fetchData";
import { saveJsonFile } from "../../helpers/updateData";
import s from "./SingleCoachPage.module.scss";
import { useLoader } from "../../helpers/LoaderHook";

export const Lang = {
  UA: "ua",
  EN: "en",
} as const;


type Lang = typeof Lang[keyof typeof Lang]


const SOCIAL_OPTIONS = ["instagram", "facebook", "telegram", "phone"] as const;
const emptyCoach: Instructor = {
  id: "",
  photo: [],
  ua: { name: "", role: "", description: "" },
  en: { name: "", role: "", description: "" },
  socials: [],
};

export const CoachPage = ({ isNew = false }: { isNew?: boolean }) => {
  const { id } = useParams();
  const [coaches, setCoaches] = useState<Instructor[]>([]);
  const [editedCoach, setEditedCoach] = useState<Instructor>(emptyCoach);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [error, setError] = useState("");

  const { setLoading } = useLoader();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchJson<Instructor[]>("coaches.json");
        setCoaches(data);

        function generateUniqueId(coaches: Instructor[]): string {
          const existingIds = coaches.map((c) => c.id);
          let id;
          do {
            id = Math.random().toString(36).slice(2, 8);
          } while (existingIds.includes(id));
          return id;
        }

        if (isNew) {
          const newId = generateUniqueId(coaches);
          setEditedCoach((prev) => ({ ...prev, id: newId }));
        } else {
          const found = data.find((c) => c.id === id);
          if (found) {
            setEditedCoach(found);
          } else {
            setError("Тренера не знайдено");
          }
        }
      } catch {
        setError("Не вдалося завантажити дані");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isNew]);

  const handleChange = (lang: Lang, field: keyof LocalizedCoachData, value: string) => {
    if (!editedCoach) return;
    setEditedCoach({
      ...editedCoach,
      [lang]: {
        ...editedCoach[lang],
        [field]: value,
      },
    });
    setIsDirty(true);
  };

  const handleCommonChange = (field: keyof Instructor, value: unknown) => {
    if (!editedCoach) return;
    setEditedCoach({
      ...editedCoach,
      [field]: value,
    });
    setIsDirty(true);
  };

  const handleSocialChange = (index: number, field: "platform" | "url", value: string) => {
    if (!editedCoach) return;
    const updatedSocials = [...editedCoach.socials];
    updatedSocials[index] = {
      ...updatedSocials[index],
      [field]: value,
    };
    setEditedCoach({
      ...editedCoach,
      socials: updatedSocials,
    });
    setIsDirty(true);
  };

  const addSocial = () => {
    if (!editedCoach) return;
    setEditedCoach({
      ...editedCoach,
      socials: [...editedCoach.socials, { platform: "instagram", url: "" }],
    });
    setIsDirty(true);
  };

  const removeSocial = (index: number) => {
    if (!editedCoach) return;
    const updated = editedCoach.socials.filter((_, i) => i !== index);
    setEditedCoach({
      ...editedCoach,
      socials: updated,
    });
    setIsDirty(true);
  };

  const isValid = () => {
    if (!editedCoach) return false;

    const { ua, en, socials, photo } = editedCoach;

    const errors: string[] = [];

    if (!ua.name || !ua.role || !ua.description) {
      errors.push("Заповніть всі поля на українській мові (Ім'я, Роль, Опис)");
    }

    if (!en.name || !en.role || !en.description) {
      errors.push("Заповніть всі поля на англійській мові (Name, Role, Description)");
    }

    if (photo.length === 0) {
      errors.push("Додайте хоча б одне фото");
    }

    socials.forEach((social, index) => {
      if (!social.platform) {
        errors.push(`Виберіть платформу для соцмережі номер ${index + 1}`);
      }
      if (!social.url) {
        errors.push(`Введіть URL або номер для соцмережі номер ${index + 1}`);
      }
    });

    if (errors.length > 0) {
      window.confirm(errors.join(", "));
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!isValid() || !editedCoach) {
      console.log("object");
      return;
    }

    let updated;
    const existingIndex = coaches.findIndex((item) => item.id === editedCoach.id);

    if (existingIndex !== -1) {
      updated = coaches.map((item) => (item.id === editedCoach.id ? editedCoach : item));
    } else {
      updated = [...coaches, editedCoach];
    }

    setCoaches(updated);
    setIsDirty(false);

    try {
      await saveJsonFile("coaches.json", updated);
      alert("Збережено!");
    } catch (err) {
      console.log(err);
      alert("Щось не так, не збережено");
    }
  };

  const handleCancel = () => {
    setIsDirty(false);
  };

  if (error) return <p>{error}</p>;

  return (
    <div className={s.CoachPage}>
      <h2> {isNew ? "Створення" : "Редагування"} тренера: {editedCoach.ua.name}</h2>

      <div className={s.section}>
        <label>ID:</label>
        <input value={editedCoach.id} onChange={(e) => handleCommonChange("id", e.target.value)} disabled />
      </div>

      <div className={s.section}>
        <label>Фото:</label>
        {editedCoach.photo.map((url, index) => (
          <div key={index} className={s.photoRow}>
            <input
              type="text"
              value={url}
              onChange={(e) => {
                const updated = [...editedCoach.photo];
                updated[index] = e.target.value;
                handleCommonChange("photo", updated);
              }}
              placeholder="URL зображення"
            />
            <img
              src={url}
              alt={`Фото ${index + 1}`}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "https://i.ibb.co/hXCwYmK/4054617.png";
              }}
            />
            <div className={s.buttonsCol}>
              <button
                type="button"
                className={s.cancel}
                onClick={() => {
                  const updated = editedCoach.photo.filter((_, i) => i !== index);
                  handleCommonChange("photo", updated);
                }}
              >
                Видалити
              </button>
            </div>
          </div>
        ))}

        <div className={s.photoRow}>
          <input
            type="text"
            value={newPhotoUrl}
            onChange={(e) => setNewPhotoUrl(e.target.value)}
            placeholder="Додати нове фото (URL)"
          />
          {newPhotoUrl && (
            <img
              src={newPhotoUrl}
              alt="Прев'ю"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "https://i.ibb.co/hXCwYmK/4054617.png";
              }}
            />
          )}
        </div>

        <button
          onClick={() => {
            if (!newPhotoUrl.trim()) return;

            setEditedCoach({
              ...editedCoach,
              photo: [...editedCoach.photo, newPhotoUrl.trim()],
            });

            setNewPhotoUrl("");
            setIsDirty(true);
          }}
          className={s.addPhoto}
          disabled={!newPhotoUrl.trim()}
        >
          Додати це фото
        </button>
      </div>


      <div className={s.langWrapper}>
        {Object.values(Lang).map((lang) => (
          <div className={s.langBlock} key={lang}>
            <h3>{lang === Lang.UA ? "Українська" : "English"}</h3>
            <label>Ім’я:</label>
            <input
              value={editedCoach[lang].name}
              onChange={(e) => handleChange(lang, "name", e.target.value)}
            />
            <label>Роль:</label>
            <input
              value={editedCoach[lang].role}
              onChange={(e) => handleChange(lang, "role", e.target.value)}
            />
            <label>Опис:</label>
            <textarea
              value={editedCoach[lang].description}
              onChange={(e) => handleChange(lang, "description", e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className={s.section}>
        <h3>Соціальні мережі:</h3>
        {editedCoach.socials.map((_, i) => (
          <div key={i} className={s.socialRow}>
            <select
              value={_.platform}
              onChange={(e) => handleSocialChange(i, "platform", e.target.value)}
            >
              {SOCIAL_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <input
              placeholder="URL або номер"
              value={_.url}
              onChange={(e) => handleSocialChange(i, "url", e.target.value)}
            />
            <button onClick={() => removeSocial(i)}>Видалити</button>
          </div>
        ))}
        <button onClick={addSocial}>Додати соцмережу</button>
      </div>

      {isDirty && (
        <div className={s.buttons}>
          <button onClick={handleSave} className={s.save}>Зберегти</button>
          <button onClick={handleCancel} className={s.cancel}>Скасувати</button>
        </div>
      )}

    </div>
  );
};
