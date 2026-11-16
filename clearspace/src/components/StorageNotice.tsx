import {
  retryUnsavedValues,
  useStorageAvailable,
} from "../hooks/useLocalStorage";

export function StorageNotice() {
  const saved = useStorageAvailable();
  if (saved) return null;
  return (
    <aside className="storage-notice" role="status">
      <p>
        This browser couldn’t save your latest changes. Keep this tab open to
        use them.
      </p>
      <button className="text-action" onClick={retryUnsavedValues}>
        Try saving again
      </button>
    </aside>
  );
}
