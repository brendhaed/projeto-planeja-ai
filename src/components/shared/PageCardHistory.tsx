import { ExternalLink, Goal, Trash } from "lucide-react";
import { Divider } from "./Divider";
import { Button } from "./Button";

interface PageCardHistoryProps{
    goalTitle: string;
    actualDate: Date;
    goalCost: number;
    months: number;
    economyInMonths: number;
    onDelete:() => void;
    onViewDetails: () => void;
}
export default function PageCardHistory({goalTitle, actualDate, goalCost, months, economyInMonths, onDelete, onViewDetails}: PageCardHistoryProps){
    const formattedDate = actualDate instanceof Date 
    ? actualDate.toLocaleDateString("pt-BR") 
    : new Date(actualDate).toLocaleDateString("pt-BR");

  // Formatador simples de Real simulando utils/currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };
    return( 
        <div className="bg-card text-foreground flex flex-col justify-between gap-6 rounded-lg p-6 shadow-sm lg:flex-row lg:items-center lg:p-8">
            <div className="flex items-center justify-center h-10 w-10 bg-[#ECE5F8] rounded-lg shrink-0">
                <Goal className="text-primary h-5 w-5" /> 
            </div>
            <div className="flex flex-col">
                <h2 className="text-foreground mb-1 text-base font-semibold">{goalTitle}</h2>
                <span className="text-muted-foreground text-sm font-light">{formattedDate}</span>
            </div>
            <div className="flex flex-col">
                <h2 className="text-muted-foreground mb-1 text-sm font-light uppercase">Custo da meta</h2>
                <span className="text-sm font-semibold">{formatCurrency(goalCost)}</span>
            </div>
            <div className="flex flex-col">
                <h2 className="text-muted-foreground mb-1 text-sm font-light uppercase">Prazo</h2>
                <span className="text-foreground text-sm font-semibold">
                    {`${months} meses`}
                </span>
            </div>
            <div className="flex flex-col">
                <h2 className="text-muted-foreground mb-1 text-sm font-light uppercase">Economia mensal</h2>
                <span className="text-foreground text-sm font-semibold">
                    {formatCurrency(economyInMonths)}
                </span>
            </div>
            <div className="flex flex-row items-center justify-center lg:justify-end gap-2 lg:gap-0">
               <Divider orientation="vertical" spacing={5} className="order-2 lg:order-1" />
               <Button variant="ghost" icon={Trash} onClick={onDelete} className="text-red-600 order-1 lg:order-2"/>
               <Button variant="secondary" icon={ExternalLink} onClick={onViewDetails} className="order-3">Ver detalhes</Button>
            </div>
        </div>
    )
}