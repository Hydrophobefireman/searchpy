import { BaseElement } from "@hydrophobefireman/kit";

export function ExternalLink(props: BaseElement<{ href: string }>) {
  return (
    <a
      {...props}
      href={props.href}
      target={props.target ?? "_blank"}
      rel="noreferrer"
    />
  );
}
