import CadastrosRecentes from "@/components/cards/CadastrosRecentes";
import CardsPainelGeral from "@/components/cards/CardsPainelGeral";
import ProximasConsultasCard from "@/components/cards/ProximasConsultasCard";
import VeterinariosDePlantao from "@/components/cards/VeterinariosDePlantao";
import VolumeDeConsultas from "@/components/cards/VolumeDeConsultas";

export default function DashBoard() {
  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      <div className="pt-4 lg:pt-8">
        <CardsPainelGeral />
      </div>

      <div className="flex w-full flex-col items-start gap-6 xl:flex-row">
        <div className="flex w-full min-w-0 flex-1 flex-col gap-6">
          <ProximasConsultasCard />
          <VolumeDeConsultas />
        </div>

        <div className="flex w-full shrink-0 flex-col gap-6 xl:w-100">
          <CadastrosRecentes />
          <VeterinariosDePlantao />
        </div>
      </div>
    </div>
  );
}
