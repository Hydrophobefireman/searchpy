import { css } from "catom";

import { TextButton } from "@kit/button";
import { Container } from "@kit/container";
import { Input } from "@kit/input";

export function SearchBox({
  value,
  setValue,
  onSubmit,
  mode = "text",
  children,
}: {
  value: string;
  setValue: any;
  onSubmit(): void;
  mode?: "text" | "images";
  children?: any;
}) {
  function handleSubmit(e: Event) {
    e.preventDefault();
    if (!value || !value.trim()) return;
    onSubmit();
  }

  return (
    <>
      <Container
        horizontal="center"
        class={css({
          boxShadow: "var(--kit-shadow)",
          padding: "2rem",
          margin: "1rem",
          minWidth: "75vw",
        })}
      >
        <form onSubmit={handleSubmit}>
          <Input.Search
            value={value}
            setValue={setValue as any}
            variant="material"
            label="Search"
            class={css({ minWidth: "60vw" })}
          />
          <Container horizontal="right">
            <TextButton mode="secondary">Search</TextButton>
          </Container>
        </form>
      </Container>
      {mode === "text" ? (
        <Container horizontal="center">
          <TextButton
            mode="secondary"
            href={
              value ? `/images?${new URLSearchParams({ q: value })}` : "/images"
            }
          >
            Image Search
          </TextButton>
        </Container>
      ) : null}
      {children}
    </>
  );
}
