import { useMemo, useRef, useState } from "react";
import { Accordion, filterItems } from "./Accordion";
import "./AccordionPlayground.css";

const QUESTION_BANK = [
  {
    id: "q1",
    question: "كم تستغرق مدة التوصيل؟",
    answer:
      "يستغرق التوصيل داخل المدينة من يوم إلى يومي عمل، وإلى المحافظات الأخرى من ثلاثة إلى خمسة أيام عمل. ستصلك رسالة تتبّع فور شحن طلبك.",
  },
  {
    id: "q2",
    question: "هل يمكنني تعديل طلبي؟",
    answer: "نعم، يمكنك تعديل العنوان أو الكمية أو إلغاء الطلب من صفحة «طلباتي» ما دام الطلب لم يُشحن بعد.",
  },
  {
    id: "q3",
    question: "ما طرق الدفع المتاحة؟",
    answer: "نقبل الدفع عند الاستلام والبطاقات المصرفية والمحافظ الإلكترونية، وتتم جميع عمليات الدفع الإلكتروني عبر قناة مشفّرة.",
  },
  {
    id: "q4",
    question: "كيف أتواصل مع الدعم؟",
    answer: "يمكنك مراسلتنا عبر الدردشة المباشرة داخل الموقع أو عبر البريد الإلكتروني، ونردّ عادةً خلال ساعتين في أوقات الدوام.",
  },
  {
    id: "q5",
    question: "سؤال معطّل (disabled)",
    answer: "هذا المحتوى غير متاح حاليًا.",
    disabled: true,
  },
  {
    id: "q6",
    question: "هل يمكنني استرجاع المنتج؟",
    answer: "يمكنك استرجاع المنتج خلال سبعة أيام من الاستلام، بشرط أن يكون بحالته الأصلية وفي عبوته.",
  },
  {
    id: "q7",
    question: "هل التوصيل متاح خارج المدينة؟",
    answer: "نعم، نوصّل إلى معظم المحافظات، وتظهر رسوم الشحن النهائية قبل تأكيد الطلب.",
  },
  {
    id: "q8",
    question: "كيف أتتبع شحنتي؟",
    answer: "افتح صفحة «طلباتي» واضغط «تتبّع الشحنة» لتعرف موقع طلبك وموعد وصوله المتوقع.",
  },
];

function buildCode(o) {
  const props = [`items={items}`, `onChange={setOpenIds}`, `variant="${o.variant}"`];
  if (o.iconType !== "chevron") props.push(`iconType="${o.iconType}"`);
  if (o.iconPosition !== "end") props.push(`iconPosition="${o.iconPosition}"`);
  if (o.headingLevel !== 3) props.push(`headingLevel={${o.headingLevel}}`);
  if (o.multiple) props.push("multiple");
  if (!o.collapsible) props.push("collapsible={false}");
  if (!o.animated) props.push("animated={false}");

  return [
    'import { useState } from "react";',
    'import { Accordion } from "./Accordion";',
    "",
    "const [openIds, setOpenIds] = useState([]);",
    "",
    "<Accordion",
    ...props.map((p) => `  ${p}`),
    "/>",
  ].join("\n");
}

function QaForm({ customItems, onAdd, onRemove }) {
  const [draft, setDraft] = useState({ question: "", answer: "" });
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState("");
  const questionRef = useRef(null);
  const answerRef = useRef(null);

  const update = (field) => (e) => {
    setDraft((d) => ({ ...d, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (notice) setNotice("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const question = draft.question.trim();
    const answer = draft.answer.trim();
    const nextErrors = {};
    if (!question) nextErrors.question = "اكتب نص السؤال أولًا.";
    if (!answer) nextErrors.answer = "اكتب الإجابة أولًا.";
    setErrors(nextErrors);

    if (nextErrors.question || nextErrors.answer) {
      (nextErrors.question ? questionRef : answerRef).current?.focus();
      return;
    }

    const id = onAdd({ question, answer });
    setDraft({ question: "", answer: "" });
    setNotice(`تمت إضافة السؤال (${id}) وظهر في القائمة.`);
    questionRef.current?.focus();
  };

  return (
    <section className="qa-form" aria-labelledby="add-title">
      <h2 id="add-title">إضافة سؤال جديد</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="new-question">السؤال</label>
          <input
            id="new-question"
            ref={questionRef}
            className="field-input"
            value={draft.question}
            onChange={update("question")}
            maxLength={140}
            placeholder="مثال: هل يوجد توصيل مجاني؟"
            aria-invalid={errors.question ? true : undefined}
          />
          {errors.question && (
            <p className="field-error" role="alert">
              {errors.question}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="new-answer">الإجابة</label>
          <textarea
            id="new-answer"
            ref={answerRef}
            className="field-textarea"
            value={draft.answer}
            onChange={update("answer")}
            rows={3}
            maxLength={600}
            placeholder="اكتب الإجابة هنا…"
            aria-invalid={errors.answer ? true : undefined}
          />
          {errors.answer && (
            <p className="field-error" role="alert">
              {errors.answer}
            </p>
          )}
        </div>
        <div className="form-actions">
          <button type="submit" className="primary-button">
            إضافة السؤال
          </button>
          <p className="form-notice" role="status">
            {notice}
          </p>
        </div>
      </form>

      {customItems.length > 0 && (
        <div className="custom-list">
          <h3>الأسئلة المضافة ({customItems.length})</h3>
          <ul>
            {customItems.map((item) => (
              <li key={item.id}>
                <span>{item.question}</span>
                <code>{item.id}</code>
                <button type="button" className="remove-button" onClick={() => onRemove(item.id)}>
                  حذف
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export default function AccordionPlayground() {
  const [count, setCount] = useState(5);
  const [variant, setVariant] = useState("separated");
  const [iconType, setIconType] = useState("chevron");
  const [iconPosition, setIconPosition] = useState("end");
  const [headingLevel, setHeadingLevel] = useState(3);
  const [multiple, setMultiple] = useState(false);
  const [collapsible, setCollapsible] = useState(true);
  const [animated, setAnimated] = useState(true);
  const [query, setQuery] = useState("");
  const [openIds, setOpenIds] = useState([]);
  const [customItems, setCustomItems] = useState([]);
  const [copied, setCopied] = useState(false);
  const nextId = useRef(1);

  const addItem = ({ question, answer }) => {
    const id = `c${nextId.current++}`;
    setCustomItems((prev) => [...prev, { id, question, answer }]);
    setQuery("");
    return id;
  };

  const removeItem = (id) => setCustomItems((prev) => prev.filter((item) => item.id !== id));

  const items = useMemo(
    () => [
      ...QUESTION_BANK.slice(0, count),
      ...customItems.map(({ id, question, answer }) => ({ id, question, answer })),
    ],
    [count, customItems],
  );

  const resultsCount = filterItems(items, query).length;
  const code = buildCode({ variant, iconType, iconPosition, headingLevel, multiple, collapsible, animated });

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard may be blocked */
    }
  };

  return (
    <div className="playground-container" dir="rtl">
      <header className="playground-header">
        <p className="eyebrow">Component Playground</p>
        <h1>
          الأكورديون <span>Accordion</span>
        </h1>
        <p className="subtitle">سؤال واحد أو أكثر، مع حركة وأيقونات وأشكال مختلفة.</p>
      </header>

      <div className="search-container">
        <input
          type="search"
          className="search-input"
          aria-label="ابحث في الأسئلة"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث في الأسئلة..."
        />
        <span className="search-icon" aria-hidden="true">
          ⌕
        </span>
      </div>

      <div className="status-bar">
        <p>
          <strong>{items.length}</strong> سؤال
          {query.trim() ? (
            <>
              {" "}
              · النتائج: <strong>{resultsCount}</strong>
            </>
          ) : null}
        </p>
        <p className="active-status">
          <i aria-hidden="true" />
          المفتوحة: <strong>[{openIds.join(", ")}]</strong>
        </p>
      </div>

      <div className="playground-layout">
        <div>
          <section className="preview-section" aria-labelledby="faq-title">
            <div className="section-header">
              <h2 id="faq-title">الأسئلة الشائعة</h2>
              <span className="item-count">{resultsCount}</span>
            </div>
            <Accordion
              items={items}
              onChange={setOpenIds}
              variant={variant}
              iconType={iconType}
              iconPosition={iconPosition}
              headingLevel={headingLevel}
              multiple={multiple}
              collapsible={collapsible}
              animated={animated}
              query={query}
            />
          </section>

          <QaForm customItems={customItems} onAdd={addItem} onRemove={removeItem} />

          <section className="live-code-section" aria-labelledby="code-preview-title">
            <div className="code-header">
              <h2 id="code-preview-title">Live Code</h2>
              <button type="button" className={`copy-button${copied ? " copied" : ""}`} onClick={copyCode}>
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <div className="code-container">
              <pre className="code-block">
                <code>{code}</code>
              </pre>
            </div>
          </section>
        </div>

        <aside className="controls-panel" aria-labelledby="props-title">
          <div className="panel-header">
            <h2 id="props-title">Props Control</h2>
          </div>
          <div className="controls-content">
            <div className="control-group">
              <label htmlFor="numberOfItems">عدد الأسئلة</label>
              <select
                id="numberOfItems"
                className="control-select"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
              >
                {[4, 5, 6, 8].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div className="control-group">
              <label htmlFor="variant">النمط (Variant)</label>
              <select
                id="variant"
                className="control-select"
                value={variant}
                onChange={(e) => setVariant(e.target.value)}
              >
                <option value="separated">separated</option>
                <option value="flush">flush</option>
              </select>
            </div>

            <div className="control-group">
              <label htmlFor="iconType">نوع الأيقونة</label>
              <select
                id="iconType"
                className="control-select"
                value={iconType}
                onChange={(e) => setIconType(e.target.value)}
              >
                <option value="chevron">chevron</option>
                <option value="plus-minus">plus-minus</option>
              </select>
            </div>

            <div className="control-group">
              <label htmlFor="iconPosition">موضع الأيقونة</label>
              <select
                id="iconPosition"
                className="control-select"
                value={iconPosition}
                onChange={(e) => setIconPosition(e.target.value)}
              >
                <option value="end">end</option>
                <option value="start">start</option>
              </select>
            </div>

            <div className="control-group">
              <label htmlFor="headingLevel">مستوى العنوان (H)</label>
              <select
                id="headingLevel"
                className="control-select"
                value={headingLevel}
                onChange={(e) => setHeadingLevel(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    عنوان {n} (h{n})
                  </option>
                ))}
              </select>
              <p className="control-hint">الوسم الحالي: {`<h${headingLevel}>`}</p>
            </div>

            <div className="control-group checkbox-group">
              <label className="checkbox-label">
                <input type="checkbox" checked={multiple} onChange={(e) => setMultiple(e.target.checked)} />
                <span>فتح أكثر من سؤال</span>
              </label>
            </div>
            <div className="control-group checkbox-group">
              <label className="checkbox-label">
                <input type="checkbox" checked={collapsible} onChange={(e) => setCollapsible(e.target.checked)} />
                <span>قابل للطي</span>
              </label>
            </div>
            <div className="control-group checkbox-group">
              <label className="checkbox-label">
                <input type="checkbox" checked={animated} onChange={(e) => setAnimated(e.target.checked)} />
                <span>مع حركة</span>
              </label>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
