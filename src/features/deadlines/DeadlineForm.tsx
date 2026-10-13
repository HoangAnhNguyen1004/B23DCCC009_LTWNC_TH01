import { useState } from 'react';
import type { FormEvent } from 'react';

import { isDateString } from '../../shared/date';
import { isPriority } from './deadlineGuards';

import type {
    CreateDeadlineInput,
} from './deadlineTypes';

interface Props {
    onAdd: (input: CreateDeadlineInput) => void;
}

const emptyForm: CreateDeadlineInput = {
    subject: '',
    title: '',
    dueDate: '',
    priority: 'medium',
};

export default function DeadlineForm({ onAdd }: Props) {
    const [form, setForm] = useState<CreateDeadlineInput>(emptyForm);
    const [error, setError] = useState<string | null>(null);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!form.subject.trim() || !form.title.trim()) {
            setError('Vui lòng nhập môn học và tên bài tập.');
            return;
        }

        if (!isDateString(form.dueDate)) {
            setError('Vui lòng chọn hạn nộp hợp lệ.');
            return;
        }

        onAdd(form);
        setForm({ ...emptyForm });
        setError(null);
    }

    return (
        <form className="card deadline-form" onSubmit={handleSubmit}>
            <h2>Thêm bài tập</h2>

            <label>
                Môn học
                <input
                    value={form.subject}
                    maxLength={100}
                    required
                    onChange={(event) => {
                        setForm({ ...form, subject: event.target.value });
                    }}
                    placeholder="Ví dụ: Lập trình Web nâng cao"
                />
            </label>

            <label>
                Tên bài tập
                <input
                    value={form.title}
                    maxLength={200}
                    required
                    onChange={(event) => {
                        setForm({ ...form, title: event.target.value });
                    }}
                    placeholder="Ví dụ: Xây dựng Deadline Tracker"
                />
            </label>

            <label>
                Hạn nộp
                <input
                    type="date"
                    required
                    value={form.dueDate}
                    onChange={(event) => {
                        setForm({ ...form, dueDate: event.target.value });
                    }}
                />
            </label>

            <label>
                Độ ưu tiên
                <select
                    value={form.priority}
                    onChange={(event) => {
                        const value = event.target.value;

                        if (isPriority(value)) {
                            setForm({ ...form, priority: value });
                        }
                    }}
                >
                    <option value="low">Thấp</option>
                    <option value="medium">Trung bình</option>
                    <option value="high">Cao</option>
                </select>
            </label>

            {error && <p role="alert" className="error">{error}</p>}

            <button type="submit" className="primary">
                Thêm bài tập
            </button>
        </form>
    );
}