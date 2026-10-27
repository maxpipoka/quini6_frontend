import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { ImportProgress } from '../ImportProgress';

const IMPORT_ID = '3f2b8c1e-5a4d-4f6e-8b7a-1c2d3e4f5a6b';

describe('ImportProgress', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('announces its state politely to screen readers', () => {
    render(<ImportProgress importId={IMPORT_ID} stage="processing" progress={0} />);

    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(status).toHaveTextContent('Procesando archivo...');
  });

  it('shows the shortened import id', () => {
    render(<ImportProgress importId={IMPORT_ID} stage="committing" progress={0} />);

    expect(screen.getByText(/3f2b8c1e\.\.\./)).toBeInTheDocument();
    expect(screen.getByText('Guardando sorteos...')).toBeInTheDocument();
  });

  it('advances progress on every tick', () => {
    render(
      <ImportProgress importId={IMPORT_ID} stage="processing" progress={0} pollInterval={100} />
    );

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '10');

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '30');
  });

  it('completes after reaching 100% and reports success once', () => {
    const onComplete = vi.fn();
    render(
      <ImportProgress
        importId={IMPORT_ID}
        stage="processing"
        progress={0}
        pollInterval={100}
        onComplete={onComplete}
      />
    );

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText('Importación completada')).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith(true);
  });

  it('stops ticking once completed', () => {
    const onComplete = vi.fn();
    render(
      <ImportProgress
        importId={IMPORT_ID}
        stage="processing"
        progress={90}
        pollInterval={100}
        onComplete={onComplete}
      />
    );

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Importación completada')).toBeInTheDocument();
  });

  it('reports completion immediately when mounted as completed', () => {
    const onComplete = vi.fn();
    render(
      <ImportProgress
        importId={IMPORT_ID}
        stage="completed"
        progress={100}
        onComplete={onComplete}
      />
    );

    expect(onComplete).toHaveBeenCalledWith(true);
  });

  it('clears the interval on unmount', () => {
    const clearSpy = vi.spyOn(window, 'clearInterval');
    const { unmount } = render(
      <ImportProgress importId={IMPORT_ID} stage="processing" progress={0} pollInterval={100} />
    );

    unmount();

    expect(clearSpy).toHaveBeenCalled();
  });
});
