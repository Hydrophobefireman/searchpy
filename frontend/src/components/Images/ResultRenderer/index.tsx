import { css } from "catom";

import { DATA_SAVER } from "@/constants";
import { ResultType } from "@/types";
import { useEffect } from "@hydrophobefireman/ui-lib";
import { Container, Resource } from "@kit/container";
import { useMount, useScroll } from "@kit/hooks";
import { Text } from "@kit/text";

import { Img } from "../Img";

const cls = css({
  borderRadius: "10px",
  margin: "2px",
  maxWidth: "30vw",
  alignSelf: "stretch",
  cursor: "pointer",
  minHeight: "200px",
  minWidth: "200px",
  backgroundColor: "rgb(128, 128, 128)",
  overflow: "hidden",
  transition: "var(--kit-transition)",
  pseudo: {
    ":hover": {
      transform: "scale(1.03)",
    },
  },
});
let scrollY: number;
export function ResultRenderer({
  resp,
  dataSaver,
  startSlideShow,
}: {
  resp: ResultType;
  dataSaver: "enabled" | "disabled" | "intermediate";
  startSlideShow(e: JSX.TargetedMouseEvent<HTMLImageElement>): void;
}) {
  useMount(() => {
    if (scrollY) window.scrollTo(0, scrollY);
  });
  useScroll(() => {
    scrollY = window.scrollY;
  });
  useEffect(() => {
    localStorage.setItem(DATA_SAVER, dataSaver);
  }, [dataSaver]);

  return (
    <Container>
      <Text.h2>Bing Images</Text.h2>
      <Container depends row class={css({ flexWrap: "wrap" })}>
        {resp ? (
          resp.bing.map((result, i) => (
            <Img
              class={cls}
              group="bing"
              result={result}
              index={i}
              startSlideShow={startSlideShow}
              dataSaver={dataSaver === "enabled"}
            />
          ))
        ) : (
          <Img class={cls} result={null} dataSaver />
        )}
      </Container>
      <Text.h2>Google Images</Text.h2>
      <Container depends row class={css({ flexWrap: "wrap" })}>
        {resp ? (
          resp.google.map((result, i) => (
            <Img
              class={cls}
              result={result}
              index={i}
              group="google"
              startSlideShow={startSlideShow}
              dataSaver={dataSaver === "enabled"}
            />
          ))
        ) : (
          <Img class={cls} result={null} dataSaver />
        )}
      </Container>
    </Container>
  );
}
