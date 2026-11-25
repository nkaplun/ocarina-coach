type FingeringPanelProps = { noteText?: string };

export function FingeringPanel({ noteText }: FingeringPanelProps) {
  return <section data-note={noteText} />;
}
