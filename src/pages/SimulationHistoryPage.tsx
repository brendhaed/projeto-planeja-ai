import { useState, useEffect } from "react";
import CardHistory from "../components/shared/PageCardHistory";
import { useNavigate } from "react-router-dom";

interface HistoryItem {
    id:string;
    goalTitle:string;
    actualDate: string;
    goalCost:number;
    months:number;
    economyInMonths:number;
}

export function SimulationHistoryPage(){
    const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
    const savedHistory = localStorage.getItem("planejai_history");
    
    if (savedHistory) {
      setHistoryList(JSON.parse(savedHistory));
    }
  }, []);

  const handleDeleteItem = (idToDelete: string) => {
    const updatedList = historyList.filter(item => item.id !== idToDelete);
    setHistoryList(updatedList);
    localStorage.setItem("planejai_history", JSON.stringify(updatedList));
  };
    return(
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <h1 className="text-3xl font-semibold mb-8 text-foreground">
        Histórico de simulações
      </h1>

      {/* Container que empilha os cards */}
      <div className="flex flex-col gap-4">
        {historyList.length === 0 ? (
          <div className="text-center py-10 border border-dashed rounded-lg border-muted-foreground/30">
            <p className="text-muted-foreground">Nenhuma simulação salva no histórico.</p>
          </div>
        ) : (
          // Mapeia a lista e renderiza os cards dinamicamente
          historyList.map((simulation) => (
            <div key={simulation.id} className="relative group">
              <CardHistory
                goalTitle={simulation.goalTitle}
                // Convertemos a string de data de volta para um objeto Date
                actualDate={new Date(simulation.actualDate)}
                goalCost={simulation.goalCost}
                months={simulation.months}
                economyInMonths={simulation.economyInMonths}
                onDelete={() => handleDeleteItem(simulation.id)}
                onViewDetails={() => navigate(`/resultados?id=${simulation.id}`)}
              />
              
            </div>
          ))
        )}
      </div>
    </main>
    )
}