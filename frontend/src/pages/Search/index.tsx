import { css } from "catom";

import { ExternalLink } from "@/components/ExternalLink";
import { SearchBox } from "@/components/SearchBox";
import { requests } from "@/http";
import { buildUrl } from "@/util/url";
import {
  Router,
  RouterSubscription,
  loadURL,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "@hydrophobefireman/ui-lib";
import { useAlerts } from "@kit/alerts";
import { TextButton } from "@kit/button";
import { Container, Resource } from "@kit/container";
import { useMount } from "@kit/hooks";
import { Text } from "@kit/text";
import { useTheme } from "@kit/theme";

interface Result {
  link: string;
  heading: string;
  cached: string | null;
  text: string;
}
interface TextSearchResults {
  query: string;
  urls: string[];
  data: Array<Result>;
}
function getSearchResults(engine: "google" | "bing", q: string, start = 0) {
  q = (q || "").trim();

  return requests.get<{ google: TextSearchResults; bing: TextSearchResults }>(
    buildUrl(
      `/api/get-${engine}?${new URLSearchParams({
        q,
        start,
        uilib: true,
      } as any).toString()}`
    )
  );
}

export default function Search() {
  const sp = useMemo(() => Router.searchParams, []);
  const [searchQuery, setQuery] = useState(() => {
    return sp.get("q");
  });
  const [value, setValue] = useState(searchQuery || "");
  const [gStart, setGStart] = useState(() => +(sp.get("start") || 0));
  const [bStart, setBStart] = useState(() => +(sp.get("start") || 0));

  const [google, setGoogle] = useState<Result[]>([]);
  const [googLoading, setGoogLoading] = useState(false);
  const [bing, setBing] = useState<Result[]>([]);
  const [bingLoading, setBingLoading] = useState(false);
  const firstRenderComplete = useRef(false);
  const [error, setError] = useState<string>(null);
  const { currentTheme } = useTheme();
  useMount(() => {
    const fn = () => {
      const q = Router.searchParams.get("q");
      setQuery(q);
      setValue(q);
    };
    RouterSubscription.subscribe(fn);
    return () => RouterSubscription.unsubscribe(fn);
  });
  if (!searchQuery) return;
  function fetchBing(increment: boolean) {
    setBingLoading(true);
    if (!increment) setBing([]);

    const bing = getSearchResults("bing", searchQuery, bStart).result;
    bing
      .then((results) => {
        try {
          setBing((x: Result[]) =>
            increment
              ? x.concat(results.data.bing.data)
              : results.data.bing.data
          );
        } catch (e) {
          setError("Cannot get results from bing");
        }
      })
      .catch(() => {
        setError("Cannot get results from bing");
      })
      .finally(() => setBingLoading(false));
  }
  function fetchGoogle(increment: boolean) {
    setGoogLoading(true);
    if (!increment) setGoogle([]);
    const goog = getSearchResults("google", searchQuery, gStart).result;

    goog
      .then((results) => {
        try {
          setGoogle((x: Result[]) =>
            increment
              ? x.concat(results.data.google.data)
              : results.data.google.data
          );
        } catch (e) {
          setError("Cannot get results from google");
        }
      })
      .catch(() => {
        setError("Cannot get results from google");
      })
      .finally(() => setGoogLoading(false));
  }
  useEffect(() => {
    fetchGoogle(true);
  }, [gStart]);
  useEffect(() => {
    if (firstRenderComplete.current) {
      fetchGoogle(false);
      fetchBing(false);
    }
    firstRenderComplete.current = true;
  }, [searchQuery]);
  useEffect(() => {
    fetchBing(true);
  }, [bStart]);

  function fetchResults(increment: boolean) {
    fetchGoogle(increment);
    fetchBing(increment);
  }
  const { persist } = useAlerts();
  useEffect(() => {
    if (error) {
      persist({
        actionText: "Retry",
        cancelText: "Okay",
        onActionClick: () => {
          setError(null);
          fetchResults(true);
        },
        content: <div>An error occured: {error}</div>,
      });
    }
  }, [error]);
  function more(e: JSX.TargetedMouseEvent<HTMLButtonElement>) {
    const f = (s: any) => (s + 10) as any;
    if (e.currentTarget.dataset.target === "google") {
      setGStart(f);
    } else {
      setBStart(f);
    }
  }
  const hasGoogResults = google.length > 0;
  const hasBingResults = bing.length > 0;

  return (
    <>
      <SearchBox
        onSubmit={() => {
          loadURL(`/search?${new URLSearchParams({ q: value }).toString()}`);
          // refetch on submit
          if (searchQuery === value) fetchResults(false);
        }}
        value={value}
        setValue={setValue}
      />

      <Container
        horizontal="left"
        class={css({ width: "100%", padding: "2.5rem" })}
      >
        <Container horizontal="left">
          <Text.h2>Results from Google</Text.h2>
          {hasGoogResults &&
            google.map((x) => (
              <ResultRenderer result={x} theme={currentTheme} />
            ))}
          <Resource isPending={googLoading} resourceName="gResults">
            {googLoading && <ResultRenderer theme={currentTheme} />}
          </Resource>
          {hasGoogResults && (
            <TextButton
              data-target="google"
              variant="material"
              mode="secondary"
              onClick={more}
            >
              Load More
            </TextButton>
          )}
        </Container>
        <Container horizontal="left">
          <Text.h2>Results from Bing</Text.h2>
          {hasBingResults &&
            bing.map((x) => <ResultRenderer result={x} theme={currentTheme} />)}
          <Resource isPending={bingLoading} resourceName="bResults">
            {bingLoading && <ResultRenderer theme={currentTheme} />}
          </Resource>
          {hasBingResults && (
            <TextButton
              data-target="bing"
              variant="material"
              mode="secondary"
              onClick={more}
            >
              Load More
            </TextButton>
          )}
        </Container>
      </Container>
    </>
  );
}

function ResultRenderer({
  result,
  theme,
}: {
  result?: Result;
  theme: "light" | "dark";
}) {
  return (
    <Container
      horizontal="left"
      depends
      class={[
        css({
          boxShadow: "var(--kit-shadow)",
          width: "80vw",
          wordBreak: "break-word",
        }),
        theme === "dark" && css({ border: "1px solid var(--kit-shade-4)" }),
        result && css({ padding: "1rem", margin: ".5rem" }),
      ]}
    >
      <ExternalLink
        class={css({ display: "block" })}
        href={result ? result.link : void 0}
      >
        {result ? result.heading : "Loading.."}
      </ExternalLink>
      <ExternalLink
        class={css({ display: "block", color: "#00651f" })}
        href={result ? result.link : void 0}
      >
        {result ? result.link.substring(0, 100) : "Loading.."}
      </ExternalLink>
      <Text.p>{result ? result.text : "Loading..."}</Text.p>
      {result && result.cached && (
        <ExternalLink href={result.cached}>View Cached</ExternalLink>
      )}
    </Container>
  );
}
