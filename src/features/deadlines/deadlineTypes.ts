export type Priority = 'low' | 'medium' | 'high';

export type DeadlineFilter =
    | 'all'
    | 'pending'
    | 'overdue'
    | 'completed';

export interface Deadline {
    id: string;
    subject: string;
    title: string;
    dueDate: string;
    priority: Priority;
    completed: boolean;
}

export type CreateDeadlineInput = Omit<
    Deadline,
    'id' | 'completed'
>;

export const PRIORITY_LABELS: Record<Priority, string> = {
    low: 'Thấp',
    medium: 'Trung bình',
    high: 'Cao',
};