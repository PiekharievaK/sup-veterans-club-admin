import { useState, useRef, useCallback, useEffect } from "react";
import s from "./IconPicker.module.scss";

const DEFAULT_ICON_NAMES = [
  "dog",
  "heart",
  "bed",
  "business-card",
  "calendar",
  "canoe-gondola",
  "request",
  "heart-add",
  "heart-plus",
  "ok-circle",
  "heart-like",
  "person-check",
];

type IconPickerProps = {
  options?: string[];
  initialValue?: string;
  onChange: (id: string) => void;
};

export const IconPicker = ({
  options = DEFAULT_ICON_NAMES,
  initialValue = "select",
  onChange,
}: IconPickerProps) => {
  const [selected, setSelected] = useState(initialValue);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);


  const handleSelectIcon = useCallback((id: string) => {
    setSelected(id);
    onChange(id); 
    setOpen(false);
  }, [onChange]);


  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setOpen(false);
    }
  }, []);


  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [handleClickOutside]);

  return (
    <div ref={ref} className={s.container}>
      <div className={s.selected} onClick={() => setOpen((prev) => !prev)}>
        <svg className={s.icon}>
          <use href={`/sprite.svg#icon-${selected}`} />
        </svg>
        <span>{selected}</span>
      </div>

      {open && (
        <div className={s.options}>
            <div
              key={"select"}
              className={s.disabled}
              onClick={() => handleSelectIcon("select")} 
            >
              <span>select...</span>
            </div>
          {options.map((id) => (
            <div
              key={id}
              className={s.option}
              onClick={() => handleSelectIcon(id)} 
            >
              <svg className={s.icon}>
                <use href={`/sprite.svg#icon-${id}`} />
              </svg>
              <span>{id}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
