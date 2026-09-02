/** Rows of one list table, in the order the site renders them. */
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import {
  FiAlertTriangle,
  FiChevronRight,
  FiCloudOff,
  FiInbox,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiTrash2,
  FiX,
} from 'react-icons/fi';

import { useAsync } from '../hooks';
import { deleteRow, describeError, listRows, type Row } from '../lib/api';
import { backdrop, dialog, listItem, listParent, press, SNAP } from '../motion';
import { titleOf, type TableDef } from '../schema';
import { RecordEdit } from './RecordEdit';
import { PageHeader, Pill, SkeletonList, StateMessage } from './ui';

interface Props {
  table: TableDef;
  onToast: (message: string) => void;
}

/** Which row the editor is open on, if any. A null `rowId` means a new one. */
type Editing = { rowId: string | null; initial: Record<string, unknown> | null } | null;

export const RecordList = ({ table, onToast }: Props) => {
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<Editing>(null);
  const [pendingDelete, setPendingDelete] = useState<Row | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { data, loading, error, reload } = useAsync(() => listRows(table.id), [table.id]);
  const rows = data ?? [];

  if (editing) {
    return (
      <RecordEdit
        table={table}
        rowId={editing.rowId}
        initial={editing.initial}
        onToast={onToast}
        onDone={(changed) => {
          setEditing(null);
          if (changed) reload();
        }}
      />
    );
  }

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteRow(table.id, pendingDelete.$id);
      onToast(`Deleted “${titleOf(pendingDelete)}”.`);
      setPendingDelete(null);
      reload();
    } catch (err) {
      onToast(`Delete failed — ${describeError(err)}`);
    } finally {
      setDeleting(false);
    }
  };

  // Client-side filter. These lists are short enough that a round trip per
  // keystroke would be slower than filtering what is already loaded.
  const needle = query.trim().toLowerCase();
  const visible = needle
    ? rows.filter((row) => {
        const subtitle = table.subtitleKey ? String(row[table.subtitleKey] ?? '') : '';
        return (
          titleOf(row).toLowerCase().includes(needle) || subtitle.toLowerCase().includes(needle)
        );
      })
    : rows;

  const body = () => {
    if (loading) return <SkeletonList />;

    if (error) {
      return (
        <StateMessage
          tone="error"
          icon={<FiCloudOff />}
          title={`Could not load ${table.label.toLowerCase()}`}
          detail={error}
          action={
            <button type="button" className="btn btn--primary" onClick={reload}>
              <FiRefreshCw /> Try again
            </button>
          }
        />
      );
    }

    if (rows.length === 0) {
      return (
        <StateMessage
          icon={<FiInbox />}
          title={`No ${table.label.toLowerCase()} yet`}
          // This is the trap in the site's merge logic, and it is worth saying
          // plainly where someone might create a single test row.
          detail={
            'While this table is empty the site shows its own built-in content. ' +
            'Adding just one row replaces that whole section — so fill it ' +
            'properly or leave it empty.'
          }
          action={
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => setEditing({ rowId: null, initial: null })}
            >
              <FiPlus /> Add the first one
            </button>
          }
        />
      );
    }

    if (visible.length === 0) {
      return (
        <StateMessage
          icon={<FiSearch />}
          title={`Nothing matches “${query}”`}
          detail={`Try a shorter search, or clear it to see all ${rows.length} entries.`}
          action={
            <button type="button" className="btn" onClick={() => setQuery('')}>
              Clear search
            </button>
          }
        />
      );
    }

    return (
      <motion.ul className="measure rows" variants={listParent} initial="hidden" animate="show">
        {/* `popLayout` lets a removed row leave while the rows below slide up to
            close the gap, rather than the list snapping shut under the cursor. */}
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((row, i) => (
            <RowCard
              key={row.$id}
              table={table}
              row={row}
              fallbackOrder={i + 1}
              onOpen={() => setEditing({ rowId: row.$id, initial: row })}
              onDelete={() => setPendingDelete(row)}
            />
          ))}
        </AnimatePresence>
      </motion.ul>
    );
  };

  return (
    <div className="screen">
      <PageHeader
        title={table.label}
        subtitle={
          loading
            ? 'Loading…'
            : `${rows.length} ${rows.length === 1 ? 'entry' : 'entries'} · shown in order on the site`
        }
        actions={
          <>
            <div className="search">
              <FiSearch aria-hidden />
              <input
                type="search"
                value={query}
                placeholder="Search…"
                aria-label={`Search ${table.label.toLowerCase()}`}
                onChange={(e) => setQuery(e.target.value)}
              />
              <AnimatePresence>
                {query && (
                  <motion.button
                    type="button"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.14 }}
                    onClick={() => setQuery('')}
                    aria-label="Clear search"
                  >
                    <FiX />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
            <motion.button
              type="button"
              className="btn btn--icon"
              onClick={reload}
              title="Reload"
              aria-label="Reload"
              whileTap={{ rotate: -180, transition: { duration: 0.4 } }}
            >
              <FiRefreshCw />
            </motion.button>
            <motion.button
              type="button"
              className="btn btn--primary"
              whileTap={press}
              whileHover={{ y: -1 }}
              onClick={() => setEditing({ rowId: null, initial: null })}
            >
              <FiPlus /> New
            </motion.button>
          </>
        }
      />
      <div className="screen__body">{body()}</div>

      <AnimatePresence>
        {pendingDelete && (
          <motion.div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            variants={backdrop}
            initial="hidden"
            animate="show"
            exit="exit"
            onClick={(e) => {
              if (e.target === e.currentTarget) setPendingDelete(null);
            }}
          >
            <motion.div className="modal__card" variants={dialog}>
              <motion.span
                className="modal__icon"
                initial={{ scale: 0.6, rotate: -12 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 460, damping: 22, delay: 0.06 }}
              >
                <FiAlertTriangle />
              </motion.span>
              <h2 id="delete-title">Delete this row?</h2>
              <p>
                “{titleOf(pendingDelete)}” will be removed from the live site. This cannot be
                undone.
              </p>
              <div className="modal__actions">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setPendingDelete(null)}
                  disabled={deleting}
                >
                  Cancel
                </button>
                <motion.button
                  type="button"
                  className="btn btn--destructive"
                  whileTap={press}
                  onClick={confirmDelete}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting…' : 'Delete'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * One row of the list. The order number leads, because that is what someone is
 * usually here to reason about, and delete only appears on hover so the list
 * does not read as a wall of bins.
 */
const RowCard = ({
  table,
  row,
  fallbackOrder,
  onOpen,
  onDelete,
}: {
  table: TableDef;
  row: Row;
  fallbackOrder: number;
  onOpen: () => void;
  onDelete: () => void;
}) => {
  const subtitle = table.subtitleKey ? String(row[table.subtitleKey] ?? '') : '';

  return (
    <motion.li layout variants={listItem} exit="exit" transition={SNAP}>
      <motion.div className="row" whileHover={{ y: -2 }} transition={{ duration: 0.14 }}>
        <button type="button" className="row__open" onClick={onOpen}>
          <span className="row__order">{String(row.order ?? fallbackOrder)}</span>
          <span className="row__text">
            <span className="row__title">
              {titleOf(row)}
              {row.featured === true && <Pill label="Featured" />}
            </span>
            {subtitle && <span className="row__subtitle">{subtitle}</span>}
          </span>
          <FiChevronRight className="row__chevron" aria-hidden />
        </button>
        <motion.button
          type="button"
          className="btn btn--icon btn--danger row__delete"
          title="Delete"
          aria-label={`Delete ${titleOf(row)}`}
          whileTap={press}
          onClick={onDelete}
        >
          <FiTrash2 />
        </motion.button>
      </motion.div>
    </motion.li>
  );
};
