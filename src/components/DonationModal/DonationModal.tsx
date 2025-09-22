import { useEffect, useState, useRef } from "react";
import s from "./DonationModal.module.scss";
import { IconPicker } from "../IconPicker/IconPicker";
import type { Donation } from "../../types/donates";

type Props = {
  donation?: Donation;
  onSave: (updated: Donation) => void;
  onClose: () => void;
};

const emptyDonation: Donation = {
  id: "",
  icon: "",
  url: "",
  ua: { title: "", summary: "" },
  en: { title: "", summary: "" },
};

export const DonationModal = ({ donation, onSave, onClose }: Props) => {
  const [local, setLocal] = useState<Donation>(donation ?? emptyDonation);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (donation) setLocal(donation);
    else setLocal(emptyDonation);
  }, [donation]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const update = (field: keyof Donation, value: string) => {
    setLocal((prev) => ({ ...prev, [field]: value }));
  };

  const updateLocalized = (
    lang: "ua" | "en",
    field: "title" | "summary",
    value: string
  ) => {
    setLocal((prev) => ({
      ...prev,
      [lang]: { ...prev[lang], [field]: value },
    }));
  };

 const handleSave = () => {
  if (!local.url.trim() || !local.icon.trim()) {
    alert("Усі поля мають бути заповнені");
    return;
  }

  onSave(local);
};

  return (
    <div className={s.overlay}>
      <div className={s.modal} ref={modalRef}>
        <button className={s.closeButton} onClick={onClose}>
          ×
        </button>

        <h2 className={s.title}>{donation ? "Редагувати донат" : "Новий донат"}</h2>

        <label className={s.label}>
          Іконка:
          <IconPicker
            initialValue={local.icon}
            onChange={(icon) => update("icon", icon)}
          />
        </label>

        <label className={s.label}>
          URL:
          <input
            className={s.input}
            type="text"
            value={local.url}
            onChange={(e) => update("url", e.target.value)}
          />
        </label>

        <fieldset className={s.fieldset}>
          <legend>Українська</legend>
          <label className={s.label}>
            Заголовок:
            <input
              className={s.input}
              type="text"
              value={local.ua.title}
              onChange={(e) => updateLocalized("ua", "title", e.target.value)}
            />
          </label>
          <label className={s.label}>
            Опис:
            <textarea
              className={s.textarea}
              value={local.ua.summary}
              onChange={(e) => updateLocalized("ua", "summary", e.target.value)}
            />
          </label>
        </fieldset>

        <fieldset className={s.fieldset}>
          <legend>English</legend>
          <label className={s.label}>
            Title:
            <input
              className={s.input}
              type="text"
              value={local.en.title}
              onChange={(e) => updateLocalized("en", "title", e.target.value)}
            />
          </label>
          <label className={s.label}>
            Summary:
            <textarea
              className={s.textarea}
              value={local.en.summary}
              onChange={(e) => updateLocalized("en", "summary", e.target.value)}
            />
          </label>
        </fieldset>

        <div className={s.actions}>
          <button className={s.cancel} onClick={onClose}>Скасувати</button>
          <button className={s.save} onClick={handleSave}>Зберегти</button>
        </div>
      </div>
    </div>
  );
};
