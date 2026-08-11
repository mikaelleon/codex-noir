export interface AccordionItem {
  q: string;
  a: string;
}
export interface AccordionProps {
  items: AccordionItem[];
}
export function Accordion(props: AccordionProps): JSX.Element;
