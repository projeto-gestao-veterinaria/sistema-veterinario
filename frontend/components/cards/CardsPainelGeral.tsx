type KpiCardProps = {
  children: React.ReactNode;
};

export default function KpiCard({ children }: KpiCardProps) {
  return (
    <div className="flex w-full min-h-32 flex-col items-start gap-2 rounded-[14px] border border-teal bg-linear-to-r from-white to-[#F0FDFA] p-3 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.031),0_10px_24px_-10px_rgba(13,148,135,0.078)] sm:min-h-40 sm:gap-3 sm:p-4 lg:min-h-45 lg:p-5">
      {children}
    </div>
  );
}
