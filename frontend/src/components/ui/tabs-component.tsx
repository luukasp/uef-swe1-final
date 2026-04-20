"use client";

import React from "react";

export type TabItem = {
  value: string;
  /** Label can be any JSX (text, icon + text, etc.) */
  label: React.ReactNode;
  /** Optional icon shown before the label (useful for lucide icons) */
  icon?: React.ReactNode;
  /** Panel content */
  children?: React.ReactNode;
};

export type TabsBasicProps = {
  items?: TabItem[];
  /** default selection for uncontrolled usage */
  defaultValue?: string;
  /** controlled value - when present, component is controlled */
  value?: string;
  /** called when selection changes */
  onChange?: (value: string) => void;
  /** additional wrapper classes */
  className?: string;
  /** horizontal only: make triggers expand to full width and distribute equally */
  fullWidth?: boolean;
  /** orientation: horizontal or vertical */
  orientation?: "horizontal" | "vertical";
  /** render only tab list */
  showList?: boolean;
  /** render only panels */
  showPanels?: boolean;
  /** loading state: when true, disable triggers and show spinner in active panel */
  loading?: boolean;
};

/**
 * TabsBasic
 *
 * - Controlled or uncontrolled
 * - Horizontal or vertical orientation
 * - Can render only list or only panels for split layouts
 * - Defaults to selecting the tab with value 'signin' if present
 * - When `loading` is true, triggers are disabled and the active panel shows a spinner overlay
 */
export default function TabsBasic({
  items = [],
  defaultValue,
  value,
  onChange,
  className = "",
  fullWidth = false,
  orientation = "horizontal",
  showList = true,
  showPanels = true,
  loading = false,
}: TabsBasicProps) {
  const normalized: TabItem[] = items.length
    ? items
    : [
        {
          value: "tab1",
          label: "Tab 1",
          children: (
            <div className="p-2 text-sm text-muted-foreground">No tabs</div>
          ),
        },
      ];

  const isControlled = typeof value === "string";

  const initialSelection =
    defaultValue ??
    normalized.find((t) => t.value === "signin")?.value ??
    normalized[0].value;

  const [internalActive, setInternalActive] =
    React.useState<string>(initialSelection);
  const active = isControlled ? (value as string) : internalActive;

  React.useEffect(() => {
    if (!isControlled) {
      if (defaultValue) setInternalActive(defaultValue);
      else
        setInternalActive(
          normalized.find((t) => t.value === "signin")?.value ??
            normalized[0].value,
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue, items.length]);

  const selectValue = (v: string) => {
    if (!isControlled) setInternalActive(v);
    onChange?.(v);
  };

  const idBase = React.useId();
  const triggersRef = React.useRef<Array<HTMLButtonElement | null>>([]);

  const focusTriggerByIndex = (index: number) => {
    const btn = triggersRef.current[index];
    if (btn) btn.focus();
  };

  // keyboard navigation: horizontal uses Left/Right, vertical uses Up/Down
  const handleTriggerKeyDown = (e: React.KeyboardEvent, index: number) => {
    const count = normalized.length;
    const horizontal = orientation === "horizontal";

    if (
      horizontal &&
      ["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)
    )
      e.preventDefault();
    if (!horizontal && ["ArrowUp", "ArrowDown", "Home", "End"].includes(e.key))
      e.preventDefault();

    if (horizontal) {
      if (e.key === "ArrowRight") {
        const next = (index + 1) % count;
        focusTriggerByIndex(next);
        selectValue(normalized[next].value);
      } else if (e.key === "ArrowLeft") {
        const prev = (index - 1 + count) % count;
        focusTriggerByIndex(prev);
        selectValue(normalized[prev].value);
      } else if (e.key === "Home") {
        focusTriggerByIndex(0);
        selectValue(normalized[0].value);
      } else if (e.key === "End") {
        focusTriggerByIndex(count - 1);
        selectValue(normalized[count - 1].value);
      }
    } else {
      if (e.key === "ArrowDown") {
        const next = (index + 1) % count;
        focusTriggerByIndex(next);
        selectValue(normalized[next].value);
      } else if (e.key === "ArrowUp") {
        const prev = (index - 1 + count) % count;
        focusTriggerByIndex(prev);
        selectValue(normalized[prev].value);
      } else if (e.key === "Home") {
        focusTriggerByIndex(0);
        selectValue(normalized[0].value);
      } else if (e.key === "End") {
        focusTriggerByIndex(count - 1);
        selectValue(normalized[count - 1].value);
      }
    }
  };

  const listBase =
    orientation === "vertical" ? "flex flex-col gap-2" : "flex gap-2";
  const listSize =
    fullWidth && orientation === "horizontal" ? "w-full" : "w-fit";

  // Active and inactive styles
  const activeBtnClasses =
    "bg-primary-600 text-white shadow-md ring-1 ring-primary-700";
  const inactiveBtnClasses = "text-foreground/90 hover:bg-primary/10";
  const disabledBtnClasses = "opacity-60 cursor-not-allowed";

  return (
    <div className={`w-full ${className}`}>
      {showList ? (
        <div
          role="tablist"
          aria-orientation={orientation}
          className={`${listBase} ${listSize} bg-transparent rounded-md p-1 mb-4`}
        >
          {normalized.map((tab, idx) => {
            const isSelected = tab.value === active;
            const baseBtn =
              orientation === "vertical"
                ? "w-full text-left flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none"
                : "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none";

            let btnClass = `${baseBtn} ${isSelected ? activeBtnClasses : inactiveBtnClasses}`;
            if (loading) btnClass += ` ${disabledBtnClasses}`;

            return (
              <button
                key={tab.value}
                ref={(el) => (triggersRef.current[idx] = el)}
                type="button"
                role="tab"
                id={`${idBase}-tab-${tab.value}`}
                aria-selected={isSelected}
                aria-controls={`${idBase}-panel-${tab.value}`}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => !loading && selectValue(tab.value)}
                onKeyDown={(e) => handleTriggerKeyDown(e, idx)}
                className={btnClass}
                disabled={loading}
              >
                {tab.icon ? (
                  <span className="inline-flex items-center mr-2">
                    {tab.icon}
                  </span>
                ) : null}
                <span className="inline-flex items-center">{tab.label}</span>
              </button>
            );
          })}
        </div>
      ) : null}

      {showPanels ? (
        <div className="w-full relative">
          {normalized.map((tab) => {
            const isSelected = tab.value === active;
            return (
              <div
                key={tab.value}
                role="tabpanel"
                id={`${idBase}-panel-${tab.value}`}
                aria-labelledby={`${idBase}-tab-${tab.value}`}
                hidden={!isSelected}
                className={`${isSelected ? "block" : "hidden"} w-full relative`}
              >
                {/* Panel content */}
                <div
                  className={`${loading ? "opacity-50 pointer-events-none" : ""}`}
                >
                  {tab.children}
                </div>

                {/* Spinner overlay when loading and this panel is active */}
                {loading && isSelected ? (
                  <div
                    className="absolute inset-0 z-10 flex items-center justify-center"
                    aria-hidden
                  >
                    <div className="flex flex-col items-center gap-2 bg-white/40 dark:bg-black/40 p-4 rounded-md backdrop-blur-sm">
                      <svg
                        className="animate-spin h-8 w-8 text-primary-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                      <span className="text-sm text-muted-foreground">
                        Loading...
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Small rounded placeholder illustration used in auth pages.
 * Accepts `className` and `rounded` props for sizing and styling.
 */
export function AuthIllustration({
  className = "",
  rounded = true,
}: {
  className?: string;
  rounded?: boolean;
}) {
  return (
    <div
      className={`w-full h-56 flex items-center justify-center bg-linear-to-br from-primary/10 to-primary/5 p-6 ${rounded ? "rounded-lg" : ""} ${className}`}
      aria-hidden
    >
      <div className="w-full h-full bg-white/6 p-6 flex items-center justify-center rounded-md">
        <svg
          width="320"
          height="200"
          viewBox="0 0 320 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="max-w-full max-h-full"
        >
          <rect
            width="320"
            height="200"
            rx="16"
            fill="rgba(255,255,255,0.04)"
          />
          <g opacity="0.9" fill="rgba(255,255,255,0.9)">
            <circle cx="60" cy="60" r="12" />
            <rect x="92" y="40" width="160" height="14" rx="4" />
            <rect x="92" y="70" width="110" height="12" rx="4" />
            <rect x="92" y="96" width="130" height="12" rx="4" />
            <rect x="92" y="122" width="84" height="10" rx="4" />
          </g>
        </svg>
      </div>
    </div>
  );
}
