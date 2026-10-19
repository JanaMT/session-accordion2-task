import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import "./Accordion.css";

const sameIds = (a, b) => a.length === b.length && a.every((id, i) => id === b[i]);

const normalize = (text = "") =>
  text
    .toLowerCase()
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه");

export function filterItems(items, query = "") {
  const q = normalize(query.trim());
  if (!q) return items;
  return items.filter((item) => normalize(item.question).includes(q));
}

function Highlight({ text, query }) {
  const q = normalize(query.trim());
  if (!q) return text;

  const haystack = normalize(text);
  const parts = [];
  let cursor = 0;
  let index = haystack.indexOf(q);

  while (index !== -1) {
    if (index > cursor) parts.push(text.slice(cursor, index));
    parts.push(<mark key={index}>{text.slice(index, index + q.length)}</mark>);
    cursor = index + q.length;
    index = haystack.indexOf(q, cursor);
  }

  parts.push(text.slice(cursor));
  return <>{parts}</>;
}

function Chevron({ open }) {
  return (
    <span aria-hidden="true" className={`accordion-icon chevron-icon${open ? " is-open" : ""}`}>
      <svg viewBox="0 0 24 24">
        <path d="M15 5l-7 7 7 7" />
      </svg>
    </span>
  );
}

function PlusMinus({ open }) {
  return (
    <span aria-hidden="true" className={`accordion-icon plus-icon${open ? " is-open" : ""}`}>
      <span className="plus-h" />
      <span className="plus-v" />
    </span>
  );
}

export function Accordion({
  items,
  variant = "separated",
  iconType = "chevron",
  iconPosition = "end",
  iconAlign,
  headingLevel = 3,
  multiple = false,
  collapsible = true,
  animated = true,
  openIds: openIdsProp,
  defaultOpenIds = [],
  onChange,
  query = "",
  emptyMessage = "لا توجد نتائج مطابقة",
  dir = "rtl",
  className = "",
}) {
  const uid = useId();
  const rootRef = useRef(null);
  const isControlled = openIdsProp !== undefined;
  const [internalIds, setInternalIds] = useState(defaultOpenIds);
  const openIds = isControlled ? openIdsProp : internalIds;

  const commit = useCallback(
    (next) => {
      if (!isControlled) setInternalIds(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  useEffect(() => {
    const existing = new Set(items.map((item) => item.id));
    let next = openIds.filter((id) => existing.has(id));
    if (!multiple && next.length > 1) next = next.slice(0, 1);
    if (!collapsible && next.length === 0) {
      const first = items.find((item) => !item.disabled);
      if (first) next = [first.id];
    }
    if (!sameIds(next, openIds)) commit(next);
  }, [items, openIds, multiple, collapsible, commit]);

  const toggle = (item) => {
    if (item.disabled) return;
    const isOpen = openIds.includes(item.id);

    if (isOpen) {
      if (!collapsible && openIds.length === 1) return;
      commit(openIds.filter((id) => id !== item.id));
    } else {
      commit(multiple ? [...openIds, item.id] : [item.id]);
    }
  };

  const handleKeyDown = (event) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    const triggers = Array.from(rootRef.current.querySelectorAll("[data-accordion-trigger]"));
    const current = triggers.indexOf(document.activeElement);
    if (current === -1) return;

    event.preventDefault();
    let next = current;
    if (event.key === "ArrowDown") next = (current + 1) % triggers.length;
    if (event.key === "ArrowUp") next = (current - 1 + triggers.length) % triggers.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = triggers.length - 1;
    triggers[next].focus();
  };

  const level = Math.min(6, Math.max(1, Number(headingLevel) || 3));
  const Heading = `h${level}`;
  const visibleItems = useMemo(() => filterItems(items, query), [items, query]);
  const resolvedIconPosition = iconAlign ?? iconPosition;
  const iconAtStart = resolvedIconPosition === "start";
  const panelRole = items.length <= 6 ? "region" : undefined;

  if (visibleItems.length === 0) {
    return (
      <p role="status" className="accordion-empty">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div
      ref={rootRef}
      dir={dir}
      onKeyDown={handleKeyDown}
      className={["accordion", variant, className].filter(Boolean).join(" ")}
    >
      {visibleItems.map((item) => {
        const isOpen = openIds.includes(item.id);
        const stuckOpen = !collapsible && isOpen && openIds.length === 1;
        const triggerId = `${uid}-trigger-${item.id}`;
        const panelId = `${uid}-panel-${item.id}`;
        const icon = iconType === "plus-minus" ? <PlusMinus open={isOpen} /> : <Chevron open={isOpen} />;

        return (
          <div
            key={item.id}
            data-state={isOpen ? "open" : "closed"}
            className={`accordion-item${isOpen ? " is-open" : ""}${item.disabled ? " disabled" : ""}`}
          >
            <Heading className={`accordion-heading heading-level-${level}`}>
              <button
                type="button"
                id={triggerId}
                data-accordion-trigger=""
                aria-expanded={isOpen}
                aria-controls={panelId}
                aria-disabled={item.disabled || stuckOpen || undefined}
                disabled={item.disabled}
                onClick={() => toggle(item)}
                className={[
                  "accordion-header",
                  iconAtStart ? "icon-start" : "icon-end",
                  stuckOpen ? "is-stuck" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {iconAtStart && icon}
                <span className="accordion-title">
                  <Highlight text={item.question} query={query} />
                </span>
                {!iconAtStart && icon}
              </button>
            </Heading>

            <div
              id={panelId}
              role={panelRole}
              aria-labelledby={triggerId}
              aria-hidden={!isOpen}
              className={`accordion-content${isOpen ? " open" : ""}${animated ? "" : " no-anim"}`}
            >
              <div className="accordion-content-inner">{item.answer}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Accordion;
