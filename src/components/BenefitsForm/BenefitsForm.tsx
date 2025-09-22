import type { FC } from "react";
import { IconPicker } from "../../components/IconPicker/IconPicker";
import s from "./BenefitForm.module.scss";
import type { Benefit } from "../../types/programs";

interface BenefitFormProps {
  benefit: Benefit;
  onBenefitChange: (field: keyof Benefit, value: string) => void;
  onIconSelect: (icon: string) => void;
  onSubmit: () => void;
}

export const BenefitForm: FC<BenefitFormProps> = ({
  benefit,
  onBenefitChange,
  onIconSelect,
  onSubmit,
}) => {
  return (
    <div className={s.addBenefitForm}>
      <div className={s.inputs}>
        <label>Назва переваги</label>
        <input
          type="text"
          placeholder="Українською"
          value={benefit.ua}
          className={s.input}
          onChange={(e) => onBenefitChange("ua", e.target.value)}
        />
        <label>Benefit title</label>
        <input
          type="text"
          placeholder="English"
          value={benefit.en}
          className={s.input}
          onChange={(e) => onBenefitChange("en", e.target.value)}
        />
      </div>
      
      <h4>Обрати зображення</h4>
      <div className={s.iconPicker}>
        <IconPicker onChange={onIconSelect} />
      </div>

      <button className={s.submit} onClick={onSubmit}>Зберегти перевагу</button>
    </div>
  );
};
