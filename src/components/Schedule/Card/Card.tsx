import type { ScheduleItem } from "../../../types/schedule";
import type { Instructor } from "../../../types/coach";
import s from "./Card.module.scss";

interface Props {
    item: ScheduleItem;
    instructors: Instructor[];
    isInPast: boolean;
    onEdit: () => void;
    onDelete: () => void;
}

export const ScheduleCard = ({ item, instructors, isInPast, onEdit, onDelete }: Props) => {
    return (
        <div className={s.item}>
            <p className={`${s.data} ${isInPast? s.past: ""}`}><b>Дата:</b> {item.date.split("-").reverse().join(" ").replace(/^(\d{2}) (\d{2})/, "$2.$1")}</p>
            <p><b>Тип:</b> {item.type}</p>
            <p><b>Час:</b> {item.timeStart} - {item.timeEnd}</p>
            <p><b>Розташування:</b> {item.location}</p>
            <p><b>Місця:</b> {item.slots}</p>
            <p>
                <b>Інструктори:</b>{" "}
                {item.instructors
                    .map((id) => instructors.find((ins) => ins.id === id)?.en.name || id)
                    .join(", ")}
            </p>
            <div className={s.buttonBox}>
                <button onClick={onEdit}>Редагувати</button>
                <button onClick={onDelete}>Видалити</button>
            </div>
        </div>
    );
};

