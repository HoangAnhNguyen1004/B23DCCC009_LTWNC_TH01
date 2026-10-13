import { Filter } from './components/Filter';
import DeadlineForm from './features/deadlines/DeadlineForm';
import DeadlineList from './features/deadlines/DeadlineList';
import { useDeadlines } from './features/deadlines/useDeadlines';

export default function App() {
  const {
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
  } = useDeadlines();

  return (
    <main className="container">
      <header>
        <p className="eyebrow">QUẢN LÝ HỌC TẬP CÁ NHÂN</p>
        <h1>Student Deadline Tracker</h1>
        <p className="muted">
          Theo dõi bài tập và hạn nộp của bạn.
        </p>
      </header>

      {(status === 'idle' || status === 'loading') && (
        <p role="status" className="card">
          Đang tải danh sách bài tập...
        </p>
      )}

      {status === 'failed' && (
        <div className="card">
          <p role="alert" className="error">
            {error}
          </p>

          <button type="button" onClick={retry}>
            Thử lại
          </button>
        </div>
      )}

      {status === 'succeeded' && (
        <>
          <div className="stats">
            <div className="card">
              Tổng bài tập
              <strong key={stats.total}>
                {stats.total}
              </strong>
            </div>

            <div className="card">
              Đã hoàn thành
              <strong key={stats.completed}>
                {stats.completed}
              </strong>
            </div>

            <div className="card">
              Quá hạn
              <strong key={stats.overdue}>
                {stats.overdue}
              </strong>
            </div>
          </div>

          <div className="layout">
            <DeadlineForm onAdd={createDeadline} />

            <section aria-label="Danh sách bài tập">
              <Filter value={filter} onChange={setFilter}>
                <Filter.Item value="all">
                  Tất cả
                </Filter.Item>

                <Filter.Item value="pending">
                  Chưa hoàn thành
                </Filter.Item>

                <Filter.Item value="overdue">
                  Quá hạn
                </Filter.Item>

                <Filter.Item value="completed">
                  Đã hoàn thành
                </Filter.Item>
              </Filter>

              <DeadlineList
                items={visibleItems}
                today={today}
                onToggle={toggle}
                onRemove={remove}
              />
            </section>
          </div>
        </>
      )}
    </main>
  );
}