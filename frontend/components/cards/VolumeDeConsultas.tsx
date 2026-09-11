type Bar = {
  dia: string;
  altura: number;
  color: "teal" | "orange";
};

const bars: Bar[] = [
  { dia: "Seg", altura: 60, color: "teal" },
  { dia: "Ter", altura: 90, color: "orange" },
  { dia: "Qua", altura: 72, color: "teal" },
  { dia: "Qui", altura: 110, color: "orange" },
  { dia: "Sex", altura: 84, color: "teal" },
  { dia: "Sáb", altura: 34, color: "orange" },
];

const barStyles = {
  teal: "rounded-t-[10px] bg-linear-to-b from-[#0D9487] to-[#26ADA1] shadow-[0_6px_14px_-6px_rgba(13,148,135,0.2)]",
  orange:
    "rounded-md bg-linear-to-b from-[#F58C2E] to-[#FAAD59] shadow-[0_6px_14px_-6px_rgba(245,158,11,0.2)]",
} as const;

export default function VolumeDeConsultas() {
  return (
    <section className="box-border flex h-76.75 w-full flex-col items-start gap-4 rounded-[14px] border border-border bg-linear-to-r from-white to-page p-6 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.0313726),0_12px_28px_-12px_rgba(13,148,135,0.0784314)]">
      <h2 className="font-outfit text-[18px] font-bold leading-5.75 text-dark-navy">
        Volume de Consultas Semanais
      </h2>

      {bars.length > 0 ? (
        <div className="relative h-55 w-full">
          <span className="absolute inset-x-0 top-10 h-px bg-border opacity-70" />
          <span className="absolute inset-x-0 top-22.5 h-px bg-border opacity-70" />
          <span className="absolute inset-x-0 top-35 h-px bg-border opacity-70" />
          <span className="absolute inset-x-0 bottom-0 h-px bg-border opacity-70" />

          <div className="absolute inset-0 z-10 flex items-end gap-4 px-5">
            {bars.map((bar) => (
              <div
                key={bar.dia}
                className="flex h-full flex-1 flex-col justify-end"
              >
                <div
                  className={`w-full ${barStyles[bar.color]}`}
                  style={{ height: bar.altura }}
                />
              </div>
            ))}
          </div>

          <div className="absolute inset-x-0 bottom-0 z-20 flex gap-4 px-5">
            {bars.map((bar) => (
              <div key={bar.dia} className="flex flex-1 justify-center">
                <span className="font-inter text-caption leading-3.75 text-light-gray">
                  {bar.dia}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex h-55 w-full flex-1 items-center justify-center">
          <span className="font-inter text-[13px] text-light-gray">
            Nenhum dado disponível.
          </span>
        </div>
      )}
    </section>
  );
}
