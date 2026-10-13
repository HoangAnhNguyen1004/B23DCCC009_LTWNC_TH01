import { useEffect, useMemo, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { daysRemaining, todayString } from '../../shared/date';
import {
    addDeadline,
    fetchDeadlines,
    removeDeadline,
    toggleDeadline,
} from './deadlinesSlice';

import type {
    CreateDeadlineInput,
    DeadlineFilter,
} from './deadlineTypes';

export function useDeadlines() {
    const dispatch = useAppDispatch();

    const { items, status, error } = useAppSelector(
        (state) => state.deadlines,
    );

    const [filter, setFilter] = useState<DeadlineFilter>('all');
    const [today, setToday] = useState(todayString);

    useEffect(() => {
        void dispatch(fetchDeadlines());
    }, [dispatch]);

    useEffect(() => {
        // Cập nhật ngày nếu người dùng để app mở qua đêm.
        const refreshDate = () => setToday(todayString());

        const timer = window.setInterval(refreshDate, 30_000);
        window.addEventListener('focus', refreshDate);

        return () => {
            window.clearInterval(timer);
            window.removeEventListener('focus', refreshDate);
        };
    }, []);

    const visibleItems = useMemo(() => {
        const filtered = items.filter((item) => {
            switch (filter) {
                case 'pending':
                    return !item.completed;

                case 'completed':
                    return item.completed;

                case 'overdue':
                    return (
                        !item.completed &&
                        daysRemaining(item.dueDate, today) < 0
                    );

                default:
                    return true;
            }
        });

        // filter() tạo mảng mới, sort không sửa mảng Redux.
        return filtered.sort(
            (a, b) => a.dueDate.localeCompare(b.dueDate),
        );
    }, [items, filter, today]);

    const stats = useMemo(() => ({
        total: items.length,
        completed: items.filter((item) => item.completed).length,
        overdue: items.filter(
            (item) =>
                !item.completed &&
                daysRemaining(item.dueDate, today) < 0,
        ).length,
    }), [items, today]);

    function createDeadline(input: CreateDeadlineInput) {
        dispatch(addDeadline({
            ...input,
            subject: input.subject.trim(),
            title: input.title.trim(),
            id: crypto.randomUUID(),
            completed: false,
        }));
    }

    function toggle(id: string) {
        dispatch(toggleDeadline(id));
    }

    function remove(id: string) {
        dispatch(removeDeadline(id));
    }

    function retry() {
        void dispatch(fetchDeadlines());
    }

    return {
        visibleItems,
        status,
        error,
        filter,
        setFilter,
        today,
        stats,
        createDeadline,
        toggle,
        remove,
        retry,
    };
}