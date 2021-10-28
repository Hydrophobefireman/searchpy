import { css } from "catom";

import { ResultRenderer } from "@/components/Images/ResultRenderer";
import { SlideShowRenderer } from "@/components/Images/SlideshowRenderer";
import { SearchBox } from "@/components/SearchBox";
import { DATA_SAVER } from "@/constants";
import { requests } from "@/http";
import { ResultType } from "@/types";
import { buildUrl } from "@/util/url";
import {
  Router,
  RouterSubscription,
  loadURL,
  useEffect,
  useMemo,
  useState,
} from "@hydrophobefireman/ui-lib";
import { useAlerts } from "@kit/alerts";
import { TextButton } from "@kit/button";
import { Container, Resource } from "@kit/container";
import { _useHideScrollbar, useMount, useResource } from "@kit/hooks";
import { Switch, useSwitch } from "@kit/input";
import { Text } from "@kit/text";

function getImages(q: string) {
  q = (q || "").trim();
  if (!q)
    return {
      result: Promise.resolve({ data: null, error: null }),
      controller: new AbortController(),
      headers: Promise.resolve(new Headers()),
    };
  return requests.get<ResultType>(
    buildUrl(`/api/images-get?${new URLSearchParams({ q }).toString()}`)
  );
}
export default function Images({}) {
  const sp = useMemo(() => Router.searchParams, []);
  const [searchQuery, setQuery] = useState(() => sp.get("q"));
  const [value, setValue] = useState(searchQuery || "");
  const { currentState, toggle } = useSwitch(
    (() => localStorage.getItem(DATA_SAVER) || "disabled") as any
  );
  useMount(() => {
    const fn = () => {
      const q = Router.searchParams.get("q");
      setQuery(q);
      setValue(q);
    };
    RouterSubscription.subscribe(fn);
    return () => RouterSubscription.unsubscribe(fn);
  });

  const { error, resp, fetchResource, clearError } = useResource(getImages, [
    searchQuery,
  ]);
  const { persist } = useAlerts();
  useEffect(() => {
    if (error) {
      persist({
        content: "An error occured",
        cancelText: "Okay",
        actionText: "Retry",
        onActionClick: () => {
          clearError();
          fetchResource();
        },
      });
    }
  }, [error]);
  const [slideShow, setSlideShow] =
    useState<{ group: string; index: number }>(null);

  function startSlideShow(e: JSX.TargetedMouseEvent<HTMLImageElement>): void {
    const { currentTarget } = e;
    const index = +currentTarget.dataset.index;
    const group = currentTarget.dataset.group;
    setSlideShow({ group, index });
  }
  const content = (
    <>
      {!slideShow ? (
        <ResultRenderer
          startSlideShow={startSlideShow}
          resp={resp}
          dataSaver={currentState}
        />
      ) : (
        <SlideShowRenderer
          resp={resp}
          group={slideShow.group}
          index={slideShow.index}
          close={() => setSlideShow(null)}
        />
      )}
    </>
  );
  return (
    <Resource resourceName="images" isPending={!resp}>
      <SearchBox
        onSubmit={() => {
          loadURL(`/images?${new URLSearchParams({ q: value }).toString()}`);
          setQuery(value);
        }}
        mode="images"
        value={value}
        setValue={setValue}
      >
        <Container row>
          <Container
            class={css({
              marginLeft: "1.5rem",
              marginRight: "1.5rem",
            })}
          >
            <Switch
              width="2.25rem"
              height="1.2rem"
              state={currentState}
              onInput={toggle}
              label="Data Saver"
            />
            <Text noMargin aria-hidden>
              Data Saver
            </Text>
          </Container>
          <TextButton
            depends
            onClick={() => setSlideShow({ group: "bing", index: 0 })}
          >
            Start Slideshow
          </TextButton>
        </Container>
      </SearchBox>
      {searchQuery && content}
    </Resource>
  );
}
