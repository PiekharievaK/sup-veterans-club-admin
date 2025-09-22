import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import s from "./PartnersEditPage.module.scss";
import { fetchJson } from "../../helpers/fetchData";
import { saveJsonFile } from "../../helpers/updateData";
import { generateUniqueId } from "../../helpers/createId";
import type { Contact, LocalizedPartnerData, Partner } from "../PartnersPage/PartnersPage";
import { Loader } from "../../components/Loader/Loader";

const CONTACT_OPTIONS = [
  "instagram",
  "facebook",
  "telegram",
  "website",
  "linkedin",
  "twitter",
  "email",
  "phone",
];



const emptyPartner: Partner = {
  id: "",
  image: "",
  contacts: [],
  ua: { name: "", description: "" },
  en: { name: "", description: "" },
};

export const PartnerEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [partner, setPartner] = useState<Partner>(emptyPartner);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id && id !== "new") {
      setLoading(true);
      fetchJson<Partner[]>("partners.json")
        .then((data) => {
          const found = data.find((p) => p.id === id);
          if (found) setPartner(found);
          else setError("Партнер не знайдений");
        })
        .catch(() => setError("Не вдалося завантажити партнера"))
        .finally(() => setLoading(false));
    }

  }, [id]);
console.log(id)
  const updateField = (field: keyof Partner, value: unknown) => {
    setPartner((prev) => ({ ...prev, [field]: value }));
  };

  const updateLocalized = (lang: "ua" | "en", field: keyof LocalizedPartnerData, value: string) => {
    setPartner((prev) => ({
      ...prev,
      [lang]: { ...prev[lang], [field]: value },
    }));
  };

  const updateContact = (index: number, field: keyof Contact, value: string) => {
    const newContacts = [...partner.contacts];
    newContacts[index] = { ...newContacts[index], [field]: value };
    setPartner((prev) => ({ ...prev, contacts: newContacts }));
  };

  const addContact = () => {
    setPartner((prev) => ({
      ...prev,
      contacts: [...prev.contacts, { title: "", url: "" }],
    }));
  };

  const removeContact = (index: number) => {
    setPartner((prev) => {
      const newContacts = [...prev.contacts];
      newContacts.splice(index, 1);
      return { ...prev, contacts: newContacts };
    });
  };

  const isValid = () => {
    if (!partner.image.trim()) return false;
    if (!partner.ua.name.trim() || !partner.en.name.trim()) return false;
    if (!partner.ua.description.trim() || !partner.en.description.trim()) return false;
    for (const c of partner.contacts) {
      if (!c.title.trim() || !c.url.trim()) return false;
    }
    return true;
  };

  const handleSave = async () => {
  if (!isValid()) {
    alert("Будь ласка, заповніть всі поля");
    return;
  }

  setSaving(true);
console.log(id)
  try {
    const partners = await fetchJson<Partner[]>("partners.json");
    let updated: Partner[];

    if (id === "new") {
      const existingIds = new Set(partners.map((p) => p.id));
      const newId = generateUniqueId(existingIds);

      const newPartner = { ...partner, id: newId };
      console.log(newPartner)
      updated = [...partners, newPartner];

      setPartner(newPartner);
    } else {
      const partnerExists = partners.some((p) => p.id === partner.id);
      if (partnerExists) {
        updated = partners.map((p) => (p.id === partner.id ? partner : p));
      } else {
        updated = [...partners, partner];
      }
    }

    await saveJsonFile("partners.json", updated);
    alert("Збережено");
    navigate("/partners");
  } catch (e) {
    alert("Сталася помилка при збереженні");
    console.log(e);
  } finally {
    setSaving(false);
  }
};


  if (loading) return <Loader/>;
  if (error) return <p>{error}</p>;

  return (
    <div className={s.PartnerEditPage}>
      <h2>{id === "new" ? "Додати партнера" : "Редагувати партнера"}</h2>

      <label>
        Фото (URL):
        <input
          type="text"
          value={partner.image}
          onChange={(e) => updateField("image", e.target.value)}
        />
      </label>

      {partner.image.trim() && (
        <div className={s.preview}>
          <img src={partner.image} alt="Превью фото партнера" />
        </div>
      )}

      <fieldset>
        <legend>Українська</legend>
        <label>
          Назва:
          <input
            type="text"
            value={partner.ua.name}
            onChange={(e) => updateLocalized("ua", "name", e.target.value)}
          />
        </label>
        <label>
          Опис:
          <textarea
            value={partner.ua.description}
            onChange={(e) => updateLocalized("ua", "description", e.target.value)}
          />
        </label>
      </fieldset>

      <fieldset>
        <legend>English</legend>
        <label>
          Name:
          <input
            type="text"
            value={partner.en.name}
            onChange={(e) => updateLocalized("en", "name", e.target.value)}
          />
        </label>
        <label>
          Description:
          <textarea
            value={partner.en.description}
            onChange={(e) => updateLocalized("en", "description", e.target.value)}
          />
        </label>
      </fieldset>

      <h3>Контакти</h3>
      {partner.contacts.map((contact, i) => (
        <div key={i} className={s.contactRow}>
          <select
            value={contact.title}
            onChange={(e) => updateContact(i, "title", e.target.value)}
          >
            <option value="" disabled>
              Виберіть платформу
            </option>
            {CONTACT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="URL"
            value={contact.url}
            onChange={(e) => updateContact(i, "url", e.target.value)}
          />
          <button type="button" onClick={() => removeContact(i)}>
            Видалити
          </button>
        </div>
      ))}

      <button type="button" onClick={addContact}>
        Додати контакт
      </button>

      <div className={s.actions}>
        <button onClick={() => navigate("/partners")}>Скасувати</button>
        <button disabled={saving} onClick={handleSave}>
          {saving ? "Збереження..." : "Зберегти"}
        </button>
      </div>
    </div>
  );
};
