// AI-assisted: see docs/AI_LOG.md #22
import { useEffect, useRef, useState } from "react";
import { fetchRoute } from "../services/directions";

// Fetches the route for one trip leg. `legKey` identifies the leg
// (for example "abc123-pickup"); the route is only requested again when the
// leg changes, not every time `from` moves. If Google fails, it falls back
// to a straight line so the map still works.
export function useRoute(legKey, from, to) {
  const [route, setRoute] = useState(null);
  const fromRef = useRef(from);
  fromRef.current = from;
  const hasFrom = Boolean(from);

  useEffect(() => {
    if (!legKey || !hasFrom || !to) return;
    let ignore = false; // cleanup: ignore answers for an old leg
    const start = fromRef.current;

    setRoute({ coordinates: [start, to], straightLine: true });
    fetchRoute(start, to)
      .then((r) => {
        if (!ignore) setRoute(r);
      })
      .catch((e) => console.log("route", e.message));

    return () => {
      ignore = true;
    };
    // `to` is fixed for a given leg, so legKey covers it
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [legKey, hasFrom]);

  return route;
}
