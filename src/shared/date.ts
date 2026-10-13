const MS_PER_DAY = 86_400_000;

export function todayString(): string {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function isDateString(value: unknown): value is string {
    if (typeof value !== 'string') return false;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

    const parsed = new Date(`${value}T00:00:00.000Z`);

    return (
        Number.isFinite(parsed.getTime()) &&
        parsed.toISOString().slice(0, 10) === value
    );
}

export function daysRemaining(
    dueDate: string,
    today: string,
): number {
    const due = Date.parse(`${dueDate}T00:00:00.000Z`);
    const current = Date.parse(`${today}T00:00:00.000Z`);

    return Math.round((due - current) / MS_PER_DAY);
}

export function deadlineLabel(
    dueDate: string,
    today: string,
): string {
    const days = daysRemaining(dueDate, today);

    return days < 0
        ? `Quá hạn ${Math.abs(days)} ngày`
        : `Còn ${days} ngày`;
}

export function formatDate(value: string): string {
    const [year, month, day] = value.split('-');
    return `${day}/${month}/${year}`;
}