import {
    deadlineLabel,
    daysRemaining,
    formatDate,
} from '../../shared/date';

import { PRIORITY_LABELS } from './deadlineTypes';
import type { Deadline } from './deadlineTypes';

interface Props {
    items: Deadline[];
    today: string;
    onToggle: (id: string) => void;
    onRemove: (id: string) => void;
}

export default function DeadlineList({
    items,
    today,
    onToggle,
    onRemove,
}: Props) {
    if (items.length === 0) {
        return (
            <p className="card empty">
                Không có bài tập trong nhóm này.
            </p>
        );
    }

    return (
        <ul className="deadline-list">
            {items.map((item) => {
                const overdue =
                    !item.completed &&
                    daysRemaining(item.dueDate, today) < 0;

                return (
                    <li key={item.id} className="card deadline-item">
                        <div className="item-heading">
                            <span className="subject">{item.subject}</span>

                            <span className={`badge ${item.priority}`}>
                                {PRIORITY_LABELS[item.priority]}
                            </span>
                        </div>

                        <h3 className={item.completed ? 'done' : ''}>
                            {item.title}
                        </h3>

                        <p>Hạn nộp: {formatDate(item.dueDate)}</p>

                        <p className={overdue ? 'error' : 'muted'}>
                            {item.completed
                                ? `Đã hoàn thành · Hạn nộp: ${deadlineLabel(item.dueDate, today)}`
                                : deadlineLabel(item.dueDate, today)}
                        </p>

                        <div className="item-actions">
                            <label className="check-label">
                                <input
                                    type="checkbox"
                                    checked={item.completed}
                                    onChange={() => onToggle(item.id)}
                                />

                                {item.completed ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
                            </label>

                            <button
                                type="button"
                                className="delete"
                                aria-label={`Xóa bài tập ${item.title}`}
                                onClick={() => onRemove(item.id)}
                            >
                                Xóa
                            </button>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}