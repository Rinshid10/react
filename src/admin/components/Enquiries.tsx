/**
 * Enquiries submitted through the site's contact form.
 *
 * Read-only apart from the status field. These are the only rows in the
 * database written by the public, and they are not readable without admin team
 * membership.
 */
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { FiChevronDown, FiCloudOff, FiFilter, FiMail, FiRefreshCw } from 'react-icons/fi';

import { useAsync } from '../hooks';
import { describeError, listEnquiries, setEnquiryStatus, type Row } from '../lib/api';
import { disclosure, listItem, listParent, press, SNAP } from '../motion';
import { ENQUIRY_STATUSES } from '../schema';
import { PageHeader, SkeletonList, StateMessage } from './ui';

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** "2026-09-02T10:41:07.123+00:00" -> "2 Sep 2026, 10:41" */
const when = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}, ${hh}:${mm}`;
};

/**
 * A single grey ramp would make every status look the same at a glance, so the
 * dot is the one place colour is allowed into the panel.
 */
const STATUS_DOT: Record<string, string> = {
  new: 'var(--ok)',
  read: 'var(--faint)',
  replied: 'var(--info)',
  archived: 'var(--faint)',
};

const statusOf = (row: Row) => String(row.status ?? 'new');

export const Enquiries = ({ onToast }: { onToast: (message: string) => void }) => {
  const [filter, setFilter] = useState<string>('all');
  const [open, setOpen] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const { data, loading, error, reload } = useAsync(() => listEnquiries(), []);
  const all = data ?? [];

  const counts = all.reduce<Record<string, number>>((acc, row) => {
    const status = statusOf(row);
    acc[status] = (acc[status] ?? 0) + 1;
    return acc;
  }, {});

  const rows = filter === 'all' ? all : all.filter((row) => statusOf(row) === filter);

  const changeStatus = async (row: Row, status: string) => {
    setBusy(row.$id);
    try {
      await setEnquiryStatus(row.$id, status);
      reload();
    } catch (err) {
      onToast(describeError(err));
    } finally {
      setBusy(null);
    }
  };

  const body = () => {
    if (loading) return <SkeletonList count={4} />;

    if (error) {
      return (
        <StateMessage
          tone="error"
          icon={<FiCloudOff />}
          title="Could not load enquiries"
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
          icon={all.length === 0 ? <FiMail /> : <FiFilter />}
          title={all.length === 0 ? 'No enquiries yet' : `Nothing marked “${filter}”`}
          detail={
            all.length === 0
              ? 'Messages sent through the contact form on the site land here.'
              : `There are ${all.length} enquiries under other statuses.`
          }
          action={
            all.length === 0 ? undefined : (
              <button type="button" className="btn" onClick={() => setFilter('all')}>
                Show all
              </button>
            )
          }
        />
      );
    }

    return (
      // Re-keyed on the filter so changing it replays the stagger — the list is
      // genuinely a different set, and animating it says so.
      <motion.ul
        key={filter}
        className="measure rows"
        variants={listParent}
        initial="hidden"
        animate="show"
      >
        {rows.map((row) => (
          <EnquiryCard
            key={row.$id}
            row={row}
            expanded={open === row.$id}
            busy={busy === row.$id}
            onToggle={() => setOpen(open === row.$id ? null : row.$id)}
            onStatus={(status) => changeStatus(row, status)}
          />
        ))}
      </motion.ul>
    );
  };

  return (
    <div className="screen">
      <PageHeader
        title="Enquiries"
        subtitle={loading ? 'Loading…' : `${all.length} total · ${counts.new ?? 0} new`}
        actions={
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
        }
      />

      {/* Filters as a strip under the header: four statuses fit, and a dropdown
          hid the counts that make this screen scannable. */}
      <div className="filters">
        <FilterChip
          label="All"
          count={all.length}
          active={filter === 'all'}
          onClick={() => setFilter('all')}
        />
        {ENQUIRY_STATUSES.map((status) => (
          <FilterChip
            key={status}
            label={status}
            count={counts[status] ?? 0}
            dot={STATUS_DOT[status]}
            active={filter === status}
            onClick={() => setFilter(status)}
          />
        ))}
      </div>

      <div className="screen__body">{body()}</div>
    </div>
  );
};

/**
 * Status filter with its count baked in. The selected fill is a shared element,
 * so it slides along the strip instead of blinking between chips.
 */
const FilterChip = ({
  label,
  count,
  active,
  onClick,
  dot,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  dot?: string;
}) => (
  <motion.button
    type="button"
    className={`chip${active ? ' chip--on' : ''}`}
    onClick={onClick}
    whileTap={press}
  >
    {active && <motion.span className="chip__fill" layoutId="filter-fill" transition={SNAP} />}
    <span className="chip__inner">
      {dot && !active && <i className="pill__dot" style={{ background: dot }} />}
      {label}
      <motion.span key={count} className="chip__count" initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        {count}
      </motion.span>
    </span>
  </motion.button>
);

const EnquiryCard = ({
  row,
  expanded,
  busy,
  onToggle,
  onStatus,
}: {
  row: Row;
  expanded: boolean;
  busy: boolean;
  onToggle: () => void;
  onStatus: (status: string) => void;
}) => {
  const status = String(row.status ?? 'new');
  const name = String(row.name ?? '');

  return (
    <motion.li variants={listItem} transition={SNAP}>
      <motion.article className={`enquiry${expanded ? ' enquiry--open' : ''}`}>
        <button type="button" className="enquiry__head" aria-expanded={expanded} onClick={onToggle}>
          <span className="enquiry__avatar">{(name[0] ?? '?').toUpperCase()}</span>
          <span className="row__text">
            <span className={`row__title${status === 'new' ? ' row__title--unread' : ''}`}>
              {String(row.subject ?? '(no subject)')}
            </span>
            <span className="row__subtitle">
              {name} · {when(row.$createdAt)}
            </span>
          </span>
          <span className="pill">
            <i className="pill__dot" style={{ background: STATUS_DOT[status] }} />
            {status}
          </span>
          <motion.span
            className="enquiry__chevron"
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.24 }}
          >
            <FiChevronDown aria-hidden />
          </motion.span>
        </button>

        {/* Real height animation rather than a display toggle, so the cards
            below are pushed down smoothly and the eye keeps its place. */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              className="enquiry__reveal"
              {...disclosure}
            >
              <div className="enquiry__body">
                <dl className="enquiry__meta">
                  <dt>From</dt>
                  <dd>
                    {name} &lt;{String(row.email ?? '')}&gt;
                  </dd>
                  {Boolean(row.projectType) && (
                    <>
                      <dt>Wants</dt>
                      <dd>{String(row.projectType)}</dd>
                    </>
                  )}
                  {Boolean(row.budget) && (
                    <>
                      <dt>Budget</dt>
                      <dd>{String(row.budget)}</dd>
                    </>
                  )}
                </dl>
                <p className="enquiry__message">{String(row.message ?? '')}</p>
                <div className="enquiry__actions">
                  <span className="section-label">Mark as</span>
                  {ENQUIRY_STATUSES.map((option) => (
                    <motion.button
                      key={option}
                      type="button"
                      className={`chip${status === option ? ' chip--on' : ''}`}
                      disabled={busy}
                      whileTap={press}
                      onClick={() => onStatus(option)}
                    >
                      {status === option && (
                        <motion.span
                          className="chip__fill"
                          layoutId={`status-${row.$id}`}
                          transition={SNAP}
                        />
                      )}
                      <span className="chip__inner">{option}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.article>
    </motion.li>
  );
};
