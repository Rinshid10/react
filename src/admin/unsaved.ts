/**
 * A flag for "there are unsaved edits on screen".
 *
 * The Flutter panel this replaced opened the editor as a full-screen route, so
 * the sidebar was physically unreachable mid-edit. Here the editor renders
 * beside the sidebar, which means one stray click could discard a form's worth
 * of typing with no warning. A ref rather than state: nothing needs to
 * re-render when it changes, it only has to be readable at the moment a nav
 * button is pressed.
 */
import { createContext, useContext, type RefObject } from 'react';

export const UnsavedContext = createContext<RefObject<boolean>>({ current: false });

export const useUnsaved = () => useContext(UnsavedContext);

export const CONFIRM_DISCARD = 'You have unsaved changes. Discard them?';
