import { isDateString } from '../../shared/date';
import type { Deadline, Priority } from './deadlineTypes';

export function isPriority(value: unknown): value is Priority {
    return value === 'low' ||
        value === 'medium' ||
        value === 'high';
}

export function isDeadline(value: unknown): value is Deadline {
    if (
        typeof value !== 'object' ||
        value === null
    ) {
        return false;
    }

    return (
        'id' in value &&
        typeof value.id === 'string' &&
        value.id.trim().length > 0 &&

        'subject' in value &&
        typeof value.subject === 'string' &&
        value.subject.trim().length > 0 &&

        'title' in value &&
        typeof value.title === 'string' &&
        value.title.trim().length > 0 &&

        'dueDate' in value &&
        isDateString(value.dueDate) &&

        'priority' in value &&
        isPriority(value.priority) &&

        'completed' in value &&
        typeof value.completed === 'boolean'
    );
}

export function isDeadlineArray(
    value: unknown,
): value is Deadline[] {
    if (!Array.isArray(value)) return false;
    if (!value.every(isDeadline)) return false;

    // Tránh id trùng gây sai khi xóa, cập nhật và render key.
    return new Set(value.map((item) => item.id)).size === value.length;
}