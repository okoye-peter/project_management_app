import { useDispatch, useSelector, useStore } from 'react-redux';
import type { AppDispatch, AppStore, RootState } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
// These are typed versions of the standard Redux hooks, ensuring type safety
// for the dispatch function and state selector.

// useAppDispatch: Returns a typed dispatch function that knows about thunks and other middleware.
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

// useAppSelector: Returns a typed selector hook that knows the structure of RootState.
export const useAppSelector = useSelector.withTypes<RootState>();

// useAppStore: Returns a typed store instance.
export const useAppStore = useStore.withTypes<AppStore>();