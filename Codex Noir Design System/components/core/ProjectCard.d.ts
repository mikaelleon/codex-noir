import React from 'react';
export interface ProjectCardProps {
  index: number | string;
  title: string;
  description: string;
  /** Optional italic pull-quote shown above the description */
  quote?: string;
  tags?: string[];
  onUnlocked?: () => void;
}
export function ProjectCard(props: ProjectCardProps): JSX.Element;
