import type { ScheduleItem } from "../../../types/schedule";
import type { Instructor } from "../../../types/coach";
import type { Program } from "../../../types/program";
import s from "./CardEdit.module.scss";

interface Props {
  item: Omit<ScheduleItem, "id"> | ScheduleItem;
  instructors: Instructor[];
  programs: Program[];
  onChange: (item: ScheduleItem | Omit<ScheduleItem, "id">) => void;
  onCancel: () => void;
  onSave: () => void;
}

export const ScheduleCardEdit = ({
  item,
  instructors,
  programs,
  onChange,
  onCancel,
  onSave,
}: Props) => {
  const updateField = <K extends keyof typeof item>(field: K, value: typeof item[K]) => {
    onChange({ ...item, [field]: value });
  };

  const updateInstructor = (index: number, value: string) => {
    const updated = [...(item.instructors || [])];
    updated[index] = value;
    onChange({ ...item, instructors: updated });
  };

  const addInstructor = () => {
    onChange({ ...item, instructors: [...(item.instructors || []), ""] });
  };

  const removeInstructor = (index: number) => {
    const updated = [...(item.instructors || [])];
    updated.splice(index, 1);
    onChange({ ...item, instructors: updated });
  };

  return (
    <div className={s.form}>
      <label>
        Дата:
        <input type="date" value={item.date} onChange={(e) => updateField("date", e.target.value)} />
      </label>

      <label>
        Тип:
        <select value={item.type} onChange={(e) => updateField("type", e.target.value)}>
          <option value="">Select...</option>
          {programs.map((program) => (
            <option key={program.category} value={program.category}>
              {program.ua.title}
            </option>
          ))}
        </select>
      </label>

      <label>
        Час початку:
        <input type="time" value={item.timeStart} onChange={(e) => updateField("timeStart", e.target.value)} />
      </label>

      <label>
        Час завершення:
        <input type="time" value={item.timeEnd} onChange={(e) => updateField("timeEnd", e.target.value)} />
      </label>

      <label>
        Розташування:
        <input type="text" value={item.location} onChange={(e) => updateField("location", e.target.value)} />
      </label>

      <label>
        Місця:
        <input
          type="number"
          min={1}
          value={item.slots}
          onChange={(e) => updateField("slots", Number(e.target.value))}
        />
      </label>

      <label>
        Посилання на захід *опціонально:
        <input
          type="text"
          value={item.link}
          onChange={(e) => updateField("link", e.target.value)}
        />
      </label>

      <label>
        Інструктори:
        {(item.instructors || []).map((instr, i) => (
          <div key={i} className={s.instructorRow}>
            <select value={instr} onChange={(e) => updateInstructor(i, e.target.value)}>
              <option value="">Select...</option>
              {instructors.map((ins) => (
                <option key={ins.id} value={ins.id}>
                  {ins.en.name}
                </option>
              ))}
            </select>

            <button type="button" onClick={() => removeInstructor(i)} className={s.smallBtn}>
              ✕
            </button>
          </div>
        ))}
        <button type="button" onClick={addInstructor} className={s.smallBtn}>
          + Додати інструктора
        </button>
      </label>

      <button onClick={onSave}>Зберегти</button>
      <button onClick={onCancel}>Закрити</button>
    </div>
  );
};
