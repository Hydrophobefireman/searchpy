import { SearchBox } from "@/components/SearchBox";
import { loadURL, useState } from "@hydrophobefireman/ui-lib";
import { Container } from "@kit/container";
import { Text } from "@kit/text";

export default function Landing() {
  const [value, setValue] = useState("");
  return (
    <Container>
      <Text.h1 noMargin align="center">
        Search-Py
      </Text.h1>
      <Text.h2 align="center" weight="normal">
        A meta search engine
      </Text.h2>
      <SearchBox
        value={value}
        setValue={setValue}
        onSubmit={() =>
          loadURL(`/search?${new URLSearchParams({ q: value }).toString()}`)
        }
      />
    </Container>
  );
}
