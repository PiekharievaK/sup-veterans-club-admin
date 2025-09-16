import { useEffect, useState } from "react";
import s from "./SchedulePage.module.scss";
import { fetchJson } from "../../helpers/fetchData";
import { saveJsonFile } from "../../helpers/updateData";
import type { ScheduleItem } from "../../types/schedule";
import type { Instructor } from "../../types/coach";
import type { Program } from "../../types/program";
import { ScheduleCard } from "../../components/Schedule/Card/Card";
import { ScheduleCardEdit } from "../../components/Schedule/CardEdit/CardEdit";
import { Loader } from "../../components/Loader/Loader";
import { generateUniqueId } from "../../helpers/createId";

export const SchedulePage = () => {
    const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
    const [availableInstructors, setAvailableInstructors] = useState<Instructor[]>([]);
    const [availablePrograms, setAvailablePrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [addingNew, setAddingNew] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const [newItem, setNewItem] = useState<Omit<ScheduleItem, "id">>({
        date: "",
        type: "",
        timeStart: "",
        timeEnd: "",
        location: "main",
        instructors: [],
        slots: 1,
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const schedule = await fetchJson<ScheduleItem[]>("schedule.json");
                const instructors = await fetchJson<Instructor[]>("coaches.json");
                const programs = await fetchJson<Program[]>("programs.json");
                setScheduleData(schedule);
                setAvailableInstructors(instructors);
                setAvailablePrograms(programs);
            } catch {
                setError("Error loading");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const validateItem = (item: ScheduleItem | Omit<ScheduleItem, "id">) => {
        return (
            item.date &&
            item.type &&
            item.timeStart &&
            item.timeEnd &&
            item.location &&
            item.slots > 0 &&
            item.instructors?.length > 0 &&
            item.instructors.every((id) => id !== "")
        );
    };

    const handleSave = async (updatedData?: ScheduleItem[]) => {
        setLoading(true);
        try {
            const cleanData = updatedData || scheduleData;
            await saveJsonFile("schedule.json", cleanData);
        } catch (e) {
            console.error("Error saving", e);
            setError("Error saving data");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (data: ScheduleItem[]) => {
        setLoading(true);
        try {
            await saveJsonFile("schedule.json", data);
        } catch (e) {
            console.error("Error saving", e);
            setError("Error saving data");
        } finally {
            setLoading(false);
        }
    };

    const toggleEdit = (id: string | null) => {
        setEditingId(id);
    };

    const updateScheduleItem = (id: string, updatedItem: ScheduleItem | Omit<ScheduleItem, "id">) => {
        setScheduleData((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...updatedItem, id } // сохраняем id
                    : item
            )
        );
    };

    const deleteItem = async (id: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this item?");
        if (!confirmDelete) return;

        const updated = scheduleData.filter((item) => item.id !== id);
        setScheduleData(updated);
        setEditingId(null);
        await handleDelete(updated);
    };

    const addNewItem = async () => {
        if (!validateItem(newItem)) {
            alert("Please fill all fields and provide valid slots.");
            return;
        }

        const existingIds = new Set(scheduleData.map((item) => item.id));
        const newId = generateUniqueId(existingIds);

        const newScheduleItem: ScheduleItem = { id: newId, ...newItem };
        const updated = [...scheduleData, newScheduleItem];
        setScheduleData(updated);
        setAddingNew(false);
        setNewItem({
            date: "",
            type: "",
            timeStart: "",
            timeEnd: "",
            location: "main",
            instructors: [],
            slots: 1,
        });
        await handleSave(updated);
    };

    const saveEditedItem = async () => {
        if (!editingId) return;

        const item = scheduleData.find((el) => el.id === editingId);
        if (!item || !validateItem(item)) {
            alert("Please fill all fields and provide valid slots.");
            return;
        }

        setEditingId(null);
        await handleSave();
    };

    const filteredData = scheduleData.filter((item) => {
        const search = searchTerm.toLowerCase();
        const instructorNames = item.instructors
            .map((id) => availableInstructors.find((i) => i.id === id)?.id || "")
            .join(" ");
        return (
            item.date.includes(search) ||
            item.type.toLowerCase().includes(search) ||
            instructorNames.includes(search)
        );
    });

    return (
        <div className={s.SchedulePage}>
            <h2>Розклад</h2>

            {loading && <Loader />}
            {error && <p className={s.error}>Error: {error}</p>}

            <input
                className={s.search}
                placeholder="Пошук по даті, типу чи інструктору"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={loading}
            />

            <button className={s.addBtn} onClick={() => setAddingNew(true)} disabled={loading}>
                Додати захід
            </button>

            {addingNew && !loading && (
                <ScheduleCardEdit
                    item={newItem}
                    instructors={availableInstructors}
                    programs={availablePrograms}
                    onChange={setNewItem}
                    onCancel={() => setAddingNew(false)}
                    onSave={addNewItem}
                />
            )}

            <div className={s.list}>
                {filteredData.map((item) =>
                    editingId === item.id ? (
                        <ScheduleCardEdit
                            key={item.id}
                            item={item}
                            instructors={availableInstructors}
                            programs={availablePrograms}
                            onChange={(updated) => updateScheduleItem(item.id, updated)}
                            onCancel={() => toggleEdit(null)}
                            onSave={saveEditedItem}
                        />
                    ) : (
                        <ScheduleCard
                            key={item.id}
                            item={item}
                            instructors={availableInstructors}
                            onEdit={() => toggleEdit(item.id)}
                            onDelete={() => deleteItem(item.id)}
                        />
                    )
                )}
            </div>
        </div>
    );
};
