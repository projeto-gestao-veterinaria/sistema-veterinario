type VolumeDeConsultasProps = {
  children?: React.ReactNode;
};

export default function VolumeDeConsultas({ children }: VolumeDeConsultasProps) {
  return (
    <section className="box-border flex w-full flex-none flex-col items-start gap-4 self-stretch rounded-[14px] border border-border bg-linear-to-r from-white to-page p-6 shadow-[0px_2px_8px_-4px_rgba(0,0,0,0.0313726),0px_12px_28px_-12px_rgba(13,148,135,0.0784314)] lg:h-76.75">
      <h2 className="font-outfit text-h3 font-bold text-dark-navy">
        Volume de Consultas
      </h2>

      <div className="flex w-full flex-1 flex-col gap-3">{children}</div>
    </section>
  );
}
