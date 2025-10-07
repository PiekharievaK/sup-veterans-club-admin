import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchJson } from "../../helpers/fetchData";
import { saveJsonFile } from "../../helpers/updateData";
import { IconPicker } from "../../components/IconPicker/IconPicker";
import { generateUniqueId } from "../../helpers/createId";
import SCHEDULE_OPTIONS from "../../data/scheduleOptions.json";
import type { Benefit, ProgramData } from "../../types/programs";
import s from "./ProgramEditPage.module.scss";
import { BenefitForm } from "../../components/BenefitsForm/BenefitsForm";
import { useLoader } from "../../helpers/LoaderHook";

export const ProgramEditPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [program, setProgram] = useState<ProgramData | null>(null);
    const [newBenefit, setNewBenefit] = useState<Benefit>({ en: "", ua: "", icon: "" });
    const [imageUrl, setImageUrl] = useState<string>("");
    const [error, setError] = useState<string>("");

    const { setLoading } = useLoader();

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            try {
                const fetchedData = await fetchJson<ProgramData[]>("programs.json");
                const existingIds = new Set(fetchedData.map((p) => p.id));
                const newId = generateUniqueId(existingIds);
                if (id === "new") {
                    setProgram({
                        id: newId,
                        schedule: "",
                        category: "",
                        image: "",
                        icon: "",
                        benefits: [{ icon: "", ua: "sting", en: "sting" }],
                        ua: { title: "", description: "" },
                        en: { title: "", description: "" },
                    });
                } else {
                    const programToEdit = fetchedData.find((p) => p.id === id);
                    if (programToEdit) {
                        setProgram(programToEdit);
                        setImageUrl(programToEdit.image || "");
                    } else {
                        navigate("/programs");
                    }
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, [id, navigate]);

    const handleChange = (lang: "ua" | "en", field: keyof ProgramData["ua"], value: string) => {
        if (program) {
            setProgram({
                ...program,
                [lang]: {
                    ...program[lang],
                    [field]: value,
                },
            });
        }
    };

    const handleSave = async () => {
        if (program) {
            if (program.benefits.length !== 3) {
                setError("Програма повинна мати рівно 3 переваги.");
                window.confirm(error)
                return;
            }

            if (
                (program.ua.title.trim().length < 2) ||
                (program.en.title.trim().length < 2) ||
                (program.ua.description.trim().length < 2) ||
                (program.en.description.trim().length < 2)
            ) {
                setError("Будь ласка, заповніть усі поля перед збереженням.");
                window.confirm(error)
                return;
            }

            try {
                setLoading(true)
                const programs = await fetchJson<ProgramData[]>("programs.json");

                if (id === "new") {

                    programs.push(program);
                    await saveJsonFile("programs.json", programs);
                } else {
                    const updatedPrograms = programs.map((p) =>
                        p.id === program.id ? program : p
                    );
                    await saveJsonFile("programs.json", updatedPrograms);
                }

                navigate("/programs");
            } catch (error) {
                console.error("Error saving program:", error);
                window.confirm(JSON.stringify(error))
            } finally {
                setLoading(false)
            }
        }
    };

    const handleAddBenefit = () => {
        if (program && program?.benefits?.length >= 3) {
            window.alert("Програма повинна мати рівно 3 переваги. Для додавання нового, спершу видаліть старий.");
            return;
        }
        if (newBenefit.ua && newBenefit.icon) {
            const updatedBenefits = [
                ...(program?.benefits || []),
                {
                    icon: newBenefit.icon,
                    ua: newBenefit.ua,
                    en: newBenefit.en,
                },
            ];

            setProgram({
                ...program!,
                benefits: updatedBenefits,
            });

            setNewBenefit({ icon: "", ua: "", en: "" });
        }
    };

    const handleSelectBenefitIcon = (icon: string) => {
        setNewBenefit({ ...newBenefit, icon });
    };

    const handleDeleteBenefit = (index: number) => {
        const confirmDelete = window.confirm("Ви дійсно хочете видалити цю перевагу?");
        if (confirmDelete && program) {
            const updatedBenefits = program.benefits.filter((_, i) => i !== index);

            setProgram({
                ...program,
                benefits: updatedBenefits,
            });
        }
    };

    const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setImageUrl(e.target.value);
        if (program) {
            setProgram({
                ...program,
                image: e.target.value,
            });
        }
    };

    const handleScheduleChange = (id: string) => {
        if (program) {
            setProgram({
                ...program,
                schedule: id,
            });
        }
    };


    if (!program) return <p>Program not found</p>;

    return (
        <div className={s.programEditPage}>
            <h2>{id === "new" ? "Створити нову програму" : `Редагувати програму: ${program.ua.title}`}</h2>

            {error && <div className={s.error}>{error}</div>}

            <div className={s.languageBlock}>
                <div className={s.inputContainer}>
                    <h3>Українська</h3>
                    <div className={s.inputColumn}>
                        <label>Title (UA):</label>
                        <input
                            type="text"
                            value={program.ua.title}
                            onChange={(e) => handleChange("ua", "title", e.target.value)}
                        />
                    </div>

                    <div className={s.inputColumn}>
                        <label>Description (UA):</label>
                        <textarea
                            value={program.ua.description}
                            onChange={(e) => handleChange("ua", "description", e.target.value)}
                        />
                    </div>
                </div>

                <div className={s.inputContainer}>
                    <h3>English</h3>
                    <div className={s.inputColumn}>
                        <label>Title (EN):</label>
                        <input
                            type="text"
                            value={program.en.title}
                            onChange={(e) => handleChange("en", "title", e.target.value)}
                        />
                    </div>

                    <div className={s.inputColumn}>
                        <label>Description (EN):</label>
                        <textarea
                            value={program.en.description}
                            onChange={(e) => handleChange("en", "description", e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className={s.inputColumn}>
                <label>Планування:</label>
                <select
                    value={program.schedule}
                    onChange={(e) => handleScheduleChange(e.target.value)}
                >
                    {SCHEDULE_OPTIONS.map((option) => (
                        <option key={option.id} value={option.id}>
                            {option.ua}
                        </option>
                    ))}
                </select>
            </div>

            <label>
                Іконка програми:
                {program.icon && <svg className={s.icon}>
                    <use href={`/sprite.svg#icon-${program.icon}`} />
                </svg>}
                <IconPicker onChange={(icon) => {
                    if (program) {
                        setProgram({
                            ...program,
                            icon: icon,
                        });
                    }
                }} />
            </label>

            <label>
                Посилання на зображення URL:
                <input
                    type="text"
                    value={imageUrl}
                    onChange={handleImageUrlChange}
                />
            </label>

            {imageUrl && (
                <div className={s.imagePreview}>
                    <img
                        src={imageUrl}
                        alt="Program Preview"
                        style={{ width: "100px", height: "auto" }}
                    />
                </div>
            )}

            <div>
                <h3>Переваги програми</h3>

                {program.benefits.length > 0 && (
                    <ul>
                        {program.benefits.map((benefit, index) => (
                            <li key={index} className={s.benefitItem}>
                                <svg className={s.icon}>
                                    <use href={`/sprite.svg#icon-${benefit.icon || "select"}`} />
                                </svg>
                                <span>{benefit.ua}</span>
                                <button onClick={() => handleDeleteBenefit(index)}>
                                    Видалити
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                {program.benefits.length < 3 && (
                    <BenefitForm
                        benefit={newBenefit}
                        onBenefitChange={(field, value) => setNewBenefit({ ...newBenefit, [field]: value })}
                        onIconSelect={handleSelectBenefitIcon}
                        onSubmit={handleAddBenefit}
                    />
                )}
            </div>

            <div className={s.actions}>
                <button onClick={() => navigate("/programs")} className={s.closeBtn}>
                    Закрити
                </button>
                <button onClick={handleSave} className={s.saveBtn}>
                    Зберегти
                </button>
            </div>
        </div>
    );
};
