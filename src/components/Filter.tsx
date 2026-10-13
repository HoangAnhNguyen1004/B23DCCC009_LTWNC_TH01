import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

import type {
    DeadlineFilter,
} from '../features/deadlines/deadlineTypes';

interface FilterContextValue {
    value: DeadlineFilter;
    onChange: (value: DeadlineFilter) => void;
}

const FilterContext = createContext<FilterContextValue | null>(null);

interface FilterProps extends FilterContextValue {
    children: ReactNode;
}

function FilterRoot({
    value,
    onChange,
    children,
}: FilterProps) {
    return (
        <FilterContext.Provider value={{ value, onChange }}>
            <div
                className="filters"
                role="group"
                aria-label="Lọc trạng thái bài tập"
            >
                {children}
            </div>
        </FilterContext.Provider>
    );
}

interface FilterItemProps {
    value: DeadlineFilter;
    children: ReactNode;
}

function FilterItem({ value, children }: FilterItemProps) {
    const context = useContext(FilterContext);

    if (!context) {
        throw new Error('Filter.Item phải nằm bên trong Filter.');
    }

    const active = context.value === value;

    return (
        <button
            type="button"
            aria-pressed={active}
            className={active ? 'filter active' : 'filter'}
            onClick={() => context.onChange(value)}
        >
            {children}
        </button>
    );
}

export const Filter = Object.assign(FilterRoot, {
    Item: FilterItem,
});