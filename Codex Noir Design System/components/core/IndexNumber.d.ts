export interface IndexNumberProps {
  /** Number (auto zero-padded to 2 digits) or a preformatted string like "01" */
  n: number | string;
}
export function IndexNumber(props: IndexNumberProps): JSX.Element;
