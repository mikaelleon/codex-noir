import React from 'react';
export interface SectionHeaderProps {
  children: React.ReactNode;
  /** Show the four-point sparkle glyph marker — use at most once per section */
  sparkle?: boolean;
}
export function SectionHeader(props: SectionHeaderProps): JSX.Element;
