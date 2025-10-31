import { useLayoutEffect, useRef, useState } from "react";
import { Pane } from "tweakpane";

interface Tweak {
  min?: number;
  max?: number;
  value: number;
}

export function useTweaks(name: string, tweaks: Record<string, Tweak>) {
  const tweaksRef = useRef(tweaks);
  const realValues = useRef(
    Object.fromEntries(
      Object.entries(tweaks).map(([key, cfg]) => [key, cfg.value])
    )
  ).current;
  const [values, setValues] = useState(realValues);

  useLayoutEffect(() => {
    const pane = new Pane({
      title: name,
      expanded: true,
    })

    const twe = tweaksRef.current;
    Object.keys(twe).forEach(key => {
      const { min, max } = twe[key];
      pane.addBinding(realValues, key, {
        min,
        max,
        step: 1,
      }).on('change', (ev) => {
        realValues[key] = ev.value;
        setValues(v => ({ ...v, [key]: ev.value }));
      });
    });

    return () => pane.dispose();
  }, [name, realValues]);
  return values;
}
