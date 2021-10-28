import { css } from "catom";

import { ExternalLink } from "@/components/ExternalLink";
import { ImageSearchResults, ResultType } from "@/types";
import { useState } from "@hydrophobefireman/ui-lib";
import { Container } from "@kit/container";
import { _useHideScrollbar, useKeyPress } from "@kit/hooks";
import { ChevronRightIcon, XIcon } from "@kit/icons";
import { Text } from "@kit/text";

import { Img } from "../Img";

const imgContainerCss = [
  css({
    position: "fixed",
    margin: "auto",
    top: 0,
    left: 0,
    right: 0,
    //@ts-ignore
    "--kit-radius": "0",
    pseudo: {
      ".kit-mask": {
        background: "var(--kit-foreground)",
        alignItems: "flex-start",
      },
    },
  }),
  "kit-mask",
].join(" ");

const titleBarExpanded = css({
  transition: "var(--kit-transition)",
  transform: "translate3d(0px,0px,0px)",
});
const titleBarCollapsed = css({
  transition: "var(--kit-transition)",
  transform: "translate3d(-80vw,0px,0px)",
});
export function SlideShowRenderer({
  group,
  index,
  resp,
  close,
}: {
  resp: ResultType;
  group: string;
  index: number;
  close(): void;
}) {
  index = index || 0;
  const allImages: ImageSearchResults[] = [].concat(resp.bing, resp.google);
  const imgIndex = group === "google" ? resp.bing.length + index : index;
  const [activeIndex, setIndex] = useState(imgIndex);
  const [expanded, setExpanded] = useState(true);
  _useHideScrollbar(true);
  useKeyPress("Escape", close, { target: window });
  const res = allImages[activeIndex];

  const onClick = (e: JSX.TargetedMouseEvent<HTMLDivElement>) => {
    const clickTarget = e.currentTarget;
    const clickTargetWidth = clickTarget.offsetWidth;
    const xCoordInClickTarget =
      e.clientX - clickTarget.getBoundingClientRect().left;
    let newIndex;
    if (clickTargetWidth / 2 > xCoordInClickTarget) {
      newIndex = activeIndex - 1;
      if (newIndex < 0) newIndex = 0;
    } else {
      newIndex = activeIndex + 1;
      if (newIndex >= allImages.length) {
        newIndex = 0;
      }
    }
    setIndex(newIndex);
  };
  useKeyPress("ArrowLeft", () => setIndex(activeIndex - 1), { target: window });
  useKeyPress("ArrowRight", () => setIndex(activeIndex + 1), {
    target: window,
  });

  function Img__deopt() {
    return (
      <Img
        onClick={onClick}
        class={css({
          margin: "auto",
          maxHeight: "90%",
          maxWidth: "90%",
          borderRadius: "5px",
        })}
        result={res}
        dataSaver={false}
        group={group}
        index={null}
      />
    );
  }
  return (
    <Container horizontal="left" class={imgContainerCss}>
      <XIcon
        onClick={close}
        color="var(--kit-foreground)"
        class={css({
          cursor: "pointer",
          position: "fixed",
          top: "5px",
          right: "5px",
          transform: "scale(1.2)",
        })}
      />
      <Container
        row
        class={[
          css({ position: "absolute", top: "5px" }),
          expanded ? titleBarExpanded : titleBarCollapsed,
        ]}
      >
        <ExternalLink
          href={res.link}
          class={css({
            padding: "0.25rem",
            width: "80vw",
            background: "var(--kit-background)",
            borderRadius: "5px",
            overflow: "hidden",
            maxHeight: "15vh",
          })}
        >
          <Text.h3
            color="kit-foreground"
            class={css({
              fontWeight: "normal",
            })}
          >
            {res.title}
          </Text.h3>
        </ExternalLink>
        <ChevronRightIcon
          class={[
            css({ cursor: "pointer", transition: "var(--kit-transition)" }),
            expanded
              ? css({
                  transform: "rotate(180deg)",
                })
              : null,
          ]}
          onClick={() => setExpanded(!expanded)}
          color="var(--kit-background)"
        />
      </Container>
      <Img__deopt />
    </Container>
  );
}
