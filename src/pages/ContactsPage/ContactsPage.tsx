import { useEffect, useState } from "react";
import { fetchJson } from "../../helpers/fetchData";
import { saveJsonFile } from "../../helpers/updateData";
import s from "./ContactsPage.module.scss";
import { Loader } from "../../components/Loader/Loader";
import type { ContactsData, LocalizedData, RepresentativeLocalized, SocialContact } from "../../types/contacts";



export const ContactsPage = () => {
  const [contactsData, setContactsData] = useState<ContactsData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchJson<ContactsData>("contacts.json");
        setContactsData(data);
      } catch {
        setError("Не вдалося завантажити контактні дані");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (error) return <p className={s.error}>{error}</p>;
  if (loading || !contactsData) return <Loader />;


  const combinedReps = contactsData.ua.representatives.map((uaRep, i) => ({
    ua: uaRep,
    en: contactsData.en.representatives[i] || { name: "", role: "" },
  }));



  const updateSocialContact = (index: number, key: keyof SocialContact, value: string) => {
    if (!contactsData) return;
    const newContacts = [...contactsData.contacts];
    newContacts[index] = { ...newContacts[index], [key]: value };
    setContactsData({ ...contactsData, contacts: newContacts });
  };

  const addSocialContact = () => {
    if (!contactsData) return;
    setContactsData({
      ...contactsData,
      contacts: [...contactsData.contacts, { platform: "", url: "" }],
    });
  };

  const removeSocialContact = (index: number) => {
    if (!contactsData) return;
    setContactsData({
      ...contactsData,
      contacts: contactsData.contacts.filter((_, i) => i !== index),
    });
  };

  const handleLocalizedFieldChange = (lang: "ua" | "en", field: keyof LocalizedData, value: string) => {
    if (!contactsData) return;
    setContactsData({
      ...contactsData,
      [lang]: { ...contactsData[lang], [field]: value },
    });
  };

  const handleCombinedRepChange = (
    index: number,
    lang: "ua" | "en",
    field: keyof RepresentativeLocalized,
    value: string
  ) => {
    if (!contactsData) return;

    const updatedUa = [...contactsData.ua.representatives];
    const updatedEn = [...contactsData.en.representatives];

    if (lang === "ua") {
      updatedUa[index] = { ...updatedUa[index], [field]: value };
      setContactsData({ ...contactsData, ua: { ...contactsData.ua, representatives: updatedUa } });
    } else {
      updatedEn[index] = { ...updatedEn[index], [field]: value };
      setContactsData({ ...contactsData, en: { ...contactsData.en, representatives: updatedEn } });
    }
  };

  const handleInstagramChange = (index: number, value: string) => {
    if (!contactsData) return;
    const updatedUa = [...contactsData.ua.representatives];
    updatedUa[index] = { ...updatedUa[index], instagram: value };
    setContactsData({ ...contactsData, ua: { ...contactsData.ua, representatives: updatedUa } });
  };

  const addRepresentative = () => {
    if (!contactsData) return;
    setContactsData({
      ...contactsData,
      ua: {
        ...contactsData.ua,
        representatives: [...contactsData.ua.representatives, { name: "", role: "", instagram: "" }],
      },
      en: {
        ...contactsData.en,
        representatives: [...contactsData.en.representatives, { name: "", role: "" }],
      },
    });
  };

  const removeRepresentative = (index: number) => {
    if (!contactsData) return;
    setContactsData({
      ...contactsData,
      ua: {
        ...contactsData.ua,
        representatives: contactsData.ua.representatives.filter((_, i) => i !== index),
      },
      en: {
        ...contactsData.en,
        representatives: contactsData.en.representatives.filter((_, i) => i !== index),
      },
    });
  };

  const handleFieldChange = (field: keyof ContactsData, value: string) => {
    if (!contactsData) return;
    setContactsData({ ...contactsData, [field]: value });
  };

  const handleSave = async () => {
    if (!contactsData) return;
    setSaving(true);
    try {
      await saveJsonFile("contacts.json", contactsData);
      alert("Дані збережено!");
    } catch (err) {
      alert("Помилка збереження: " + err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={s.contactsPage}>
      <h1 className={s.title}>Контакти організації</h1>

      <label className={s.label}>
        Телефон:
        <input
          className={s.input}
          type="text"
          value={contactsData.phone}
          onChange={(e) => handleFieldChange("phone", e.target.value)}
        />
      </label>

      <label className={s.label}>
        Email:
        <input
          className={s.input}
          type="email"
          value={contactsData.email}
          onChange={(e) => handleFieldChange("email", e.target.value)}
        />
      </label>

      <h2 className={s.subtitle}>Соціальні мережі</h2>
      {contactsData.contacts.map((contact, i) => (
        <div key={i} className={s.contactRow}>
          <select
            className={s.select}
            value={contact.platform}
            onChange={(e) => updateSocialContact(i, "platform", e.target.value)}
          >
            <option value="">Виберіть платформу</option>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="telegram">Telegram</option>
            <option value="twitter">Twitter</option>
            <option value="other">Інше</option>
          </select>
          <input
            className={s.input}
            type="text"
            placeholder="URL або контакт"
            value={contact.url}
            onChange={(e) => updateSocialContact(i, "url", e.target.value)}
          />
          <button className={s.removeBtn} onClick={() => removeSocialContact(i)}>
            Видалити
          </button>
        </div>
      ))}
      <button className={s.addBtn} onClick={addSocialContact}>
        Додати соцмережу
      </button>

      <h2 className={s.subtitle}>Дані організації (Українська)</h2>
      <label className={s.label}>
        Повна назва:
        <input
          className={s.input}
          type="text"
          value={contactsData.ua.officialName}
          onChange={(e) => handleLocalizedFieldChange("ua", "officialName", e.target.value)}
        />
      </label>
      <label className={s.label}>
        Коротка назва:
        <input
          className={s.input}
          type="text"
          value={contactsData.ua.shortName}
          onChange={(e) => handleLocalizedFieldChange("ua", "shortName", e.target.value)}
        />
      </label>
      <label className={s.label}>
        Адреса:
        <input
          className={s.input}
          type="text"
          value={contactsData.ua.address}
          onChange={(e) => handleLocalizedFieldChange("ua", "address", e.target.value)}
        />
      </label>

      <h2 className={s.subtitle}>Дані організації (English)</h2>
      <label className={s.label}>
        Full Name:
        <input
          className={s.input}
          type="text"
          value={contactsData.en.officialName}
          onChange={(e) => handleLocalizedFieldChange("en", "officialName", e.target.value)}
        />
      </label>
      <label className={s.label}>
        Short Name:
        <input
          className={s.input}
          type="text"
          value={contactsData.en.shortName}
          onChange={(e) => handleLocalizedFieldChange("en", "shortName", e.target.value)}
        />
      </label>
      <label className={s.label}>
        Address:
        <input
          className={s.input}
          type="text"
          value={contactsData.en.address}
          onChange={(e) => handleLocalizedFieldChange("en", "address", e.target.value)}
        />
      </label>

      <h2 className={s.subtitle}>Представники організації</h2>
      {combinedReps.map((rep, i) => (
        <div key={i} className={s.repRow}>
          <div className={s.langBlock}>
            <label>Українська Ім'я:</label>
            <input
              className={s.input}
              value={rep.ua.name}
              onChange={(e) => handleCombinedRepChange(i, "ua", "name", e.target.value)}
            />
            <label>Українська Роль:</label>
            <input
              className={s.input}
              value={rep.ua.role}
              onChange={(e) => handleCombinedRepChange(i, "ua", "role", e.target.value)}
            />
          </div>

          <div className={s.langBlock}>
            <label>English Name:</label>
            <input
              className={s.input}
              value={rep.en.name}
              onChange={(e) => handleCombinedRepChange(i, "en", "name", e.target.value)}
            />
            <label>English Role:</label>
            <input
              className={s.input}
              value={rep.en.role}
              onChange={(e) => handleCombinedRepChange(i, "en", "role", e.target.value)}
            />
          </div>

          <div className={s.langBlock}>
            <label>Instagram URL:</label>
            <input
              className={s.input}
              value={rep.ua.instagram || ""}
              onChange={(e) => handleInstagramChange(i, e.target.value)}
            />
          </div>

          <button className={s.removeBtn} onClick={() => removeRepresentative(i)}>
            Видалити
          </button>
        </div>
      ))}
      <button className={s.addBtn} onClick={addRepresentative}>
        Додати представника
      </button>

      <div className={s.saveBtnContainer}>
        <button onClick={handleSave} className={s.saveBtn} disabled={saving}>
          {saving ? "Збереження..." : "Зберегти"}
        </button>
      </div>
    </div>
  );
};
