import toastReducer, {
  addToast,
  removeToast,
  clearToasts,
  selectToasts,
} from '../toastSlice';

describe('toastSlice', () => {
  const initialState = { toasts: [] };

  describe('reducers', () => {
    it('should return initial state', () => {
      expect(toastReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should add a toast', () => {
      const action = addToast({
        type: 'success',
        message: 'Test message',
      });
      const state = toastReducer(initialState, action);
      expect(state.toasts).toHaveLength(1);
      expect(state.toasts[0].type).toBe('success');
      expect(state.toasts[0].message).toBe('Test message');
      expect(state.toasts[0].id).toBeDefined();
      expect(state.toasts[0].duration).toBe(3000);
    });

    it('should use custom duration when provided', () => {
      const action = addToast({
        type: 'error',
        message: 'Error message',
        duration: 5000,
      });
      const state = toastReducer(initialState, action);
      expect(state.toasts[0].duration).toBe(5000);
    });

    it('should add multiple toasts', () => {
      const state1 = toastReducer(
        initialState,
        addToast({ type: 'success', message: 'First' })
      );
      const state2 = toastReducer(
        state1,
        addToast({ type: 'error', message: 'Second' })
      );
      expect(state2.toasts).toHaveLength(2);
      expect(state2.toasts[0].message).toBe('First');
      expect(state2.toasts[1].message).toBe('Second');
    });

    it('should remove a toast by id', () => {
      const state1 = toastReducer(
        initialState,
        addToast({ type: 'success', message: 'First' })
      );
      const state2 = toastReducer(
        state1,
        addToast({ type: 'error', message: 'Second' })
      );
      const toastId = state2.toasts[0].id;
      const state3 = toastReducer(state2, removeToast(toastId));
      expect(state3.toasts).toHaveLength(1);
      expect(state3.toasts[0].message).toBe('Second');
    });

    it('should clear all toasts', () => {
      const state1 = toastReducer(
        initialState,
        addToast({ type: 'success', message: 'First' })
      );
      const state2 = toastReducer(
        state1,
        addToast({ type: 'error', message: 'Second' })
      );
      const state3 = toastReducer(state2, clearToasts());
      expect(state3.toasts).toHaveLength(0);
    });
  });

  describe('selectors', () => {
    it('should select toasts from state', () => {
      const state = {
        toast: {
          toasts: [
            { id: '1', type: 'success' as const, message: 'Test', duration: 3000 },
          ],
        },
      };
      expect(selectToasts(state)).toEqual(state.toast.toasts);
    });
  });
});

