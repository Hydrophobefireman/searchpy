import { ImageSearchResults } from "@/types";
import { BaseElement } from "@hydrophobefireman/kit";
import { useEffect, useState } from "@hydrophobefireman/ui-lib";
import { BaseDom } from "@kit/base-dom";

export function Img({
  result,
  dataSaver,
  index,
  startSlideShow,
  group,
  class: klass,
  ...rest
}: BaseElement<{
  result: ImageSearchResults;
  dataSaver: boolean;
  index?: number;
  group?: string;
  class?: any;
  startSlideShow?(e: JSX.TargetedMouseEvent<HTMLImageElement>): void;
}>) {
  if (result === null) return <div class={klass}>Loading</div>;
  const { fallback, img, title } = result;
  const init = () => (dataSaver ? fallback : img);
  const [src, setSrc] = useState(init);

  useEffect(() => setSrc(init), [dataSaver, img, fallback]);
  function onError() {
    if (src === img) setSrc(fallback);
  }
  return (
    <BaseDom
      element="img"
      class={klass}
      title={title}
      data-result={JSON.stringify(result)}
      data-group={group}
      data-index={index}
      loading="lazy"
      onError={onError}
      onClick={startSlideShow}
      src={src}
      {...rest}
    />
  );
}
