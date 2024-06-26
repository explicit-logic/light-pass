import { useStore } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import { compareResponders } from '@/helpers/compareResponders';

import { type ResponderState, responderStore } from '@/store/responderStore';

export function useResponderStore(): ResponderState;
export function useResponderStore<T>(selector: (state: ResponderState) => T): T;
export function useResponderStore<T>(selector?: (state: ResponderState) => T) {
  return useStore(responderStore, selector!);
}

useResponderStore.use = {
  addResponder: () => useResponderStore(({ addResponder }) => addResponder),
  complete: () => useResponderStore(({ complete }) => complete),
  doProgress: () => useResponderStore(({ doProgress }) => doProgress),
  identify: () => useResponderStore(({ identify }) => identify),
  responders: () => useResponderStore(useShallow(({ responders }) => Object.values(responders).sort(compareResponders))),
  respondersTree: () => useResponderStore(useShallow(({ responders }) => responders)),
  setConnectionState: () => useResponderStore(({ setConnectionState }) => setConnectionState),
};
