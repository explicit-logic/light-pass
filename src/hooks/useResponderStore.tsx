import { useStore } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import { type ResponderState, responderStore } from '@/store/responderStore';

export function useResponderStore(): ResponderState;
export function useResponderStore<T>(selector: (state: ResponderState) => T): T;
export function useResponderStore<T>(selector?: (state: ResponderState) => T) {
  return useStore(responderStore, selector!);
}

useResponderStore.use = {
  addResponder: () => useResponderStore(({ addResponder }) => addResponder),
  responders: () => useResponderStore(useShallow(({ responders }) => Object.values(responders))),
  setIdentified: () => useResponderStore(({ setIdentified }) => setIdentified),
};
