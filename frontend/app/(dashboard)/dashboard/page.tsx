import KpiCard from "@/components/cards/CardsPainelGeral";
import CadastrosRecentes from "@/components/cards/CadastrosRecentes";
import ProximasConsultasCard from "@/components/cards/ProximasConsultasCard";
import VeterinariosDePlantao from "@/components/cards/VeterinariosDePlantao";
import VolumeDeConsultas from "@/components/cards/VolumeDeConsultas";

export default function DashBoard() {
  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      <div className="grid grid-cols-1 gap-2 pt-4 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4 lg:gap-4 lg:pt-8">
        <KpiCard>...</KpiCard>
        <KpiCard>...</KpiCard>
        <KpiCard>...</KpiCard>
        <KpiCard>...</KpiCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-10">
        <div className="flex flex-col gap-4 lg:gap-6">
          <ProximasConsultasCard />
          <VolumeDeConsultas />
        </div>

        <div className="flex flex-col gap-4 lg:gap-6">
          <CadastrosRecentes />
          <VeterinariosDePlantao />
        </div>
      </div>
    </div>
  );
}
