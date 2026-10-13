import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { getApiData } from '../../shared/api';
import { isDeadlineArray } from './deadlineGuards';
import type { Deadline } from './deadlineTypes';

interface DeadlinesState {
    items: Deadline[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: DeadlinesState = {
    items: [],
    status: 'idle',
    error: null,
};

export const fetchDeadlines = createAsyncThunk<
    Deadline[],
    void,
    {
        state: { deadlines: DeadlinesState };
        rejectValue: string;
    }
>(
    'deadlines/fetchAll',
    async (_, { rejectWithValue, signal }) => {
        try {
            return await getApiData<Deadline[]>(
                `${import.meta.env.BASE_URL}deadlines.json`,
                isDeadlineArray,
                signal,
            );
        } catch (error: unknown) {
            return rejectWithValue(
                error instanceof Error
                    ? error.message
                    : 'Đã xảy ra lỗi khi tải bài tập.',
            );
        }
    },
    {
        condition: (_, { getState }) => {
            const status = getState().deadlines.status;

            // Chỉ tải ban đầu hoặc thử lại sau khi thất bại.
            return status === 'idle' || status === 'failed';
        },
    },
);

const deadlinesSlice = createSlice({
    name: 'deadlines',
    initialState,
    reducers: {
        addDeadline(state, action: PayloadAction<Deadline>) {
            state.items.push(action.payload);
        },

        toggleDeadline(state, action: PayloadAction<string>) {
            const item = state.items.find(
                (deadline) => deadline.id === action.payload,
            );

            if (item) {
                item.completed = !item.completed;
            }
        },

        removeDeadline(state, action: PayloadAction<string>) {
            state.items = state.items.filter(
                (deadline) => deadline.id !== action.payload,
            );
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDeadlines.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchDeadlines.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
                state.error = null;
            })
            .addCase(fetchDeadlines.rejected, (state, action) => {
                state.status = 'failed';
                state.error =
                    action.payload ??
                    action.error.message ??
                    'Không tải được danh sách bài tập.';
            });
    },
});

export const {
    addDeadline,
    toggleDeadline,
    removeDeadline,
} = deadlinesSlice.actions;

export default deadlinesSlice.reducer;