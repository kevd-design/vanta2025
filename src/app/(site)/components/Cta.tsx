import ArrowRight from "../elements/ArrowRight";

export default function Cta({label}: {label: string}) {
  return (
    <div className="m-8 flex justify-between items-center gap-2">
      <div className="text-lg">{label}</div>
      <ArrowRight />
    </div>
  );
}