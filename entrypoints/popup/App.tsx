import mascotte from "@/assets/mascotte-0.png";
import { Card, CardHeader, CardTitle } from "./components/Card";
import { Button } from "./components/Button";
import { Input } from "./components/Input";

function App() {
  const [setup, setSetup] = useState(false);
  const [key, setKey] = useState("");

  useEffect(() => {
    // Leggi la chiave API dallo storage del browser
    const fetchKey = async () => {
      const key = await storage.getItem<string>("local:api-key");
      setSetup(!!key);
    };

    fetchKey();
  }, []);

  // Se non è configurato, mostra il form di configurazione
  if (!setup)
    return (
      <main>
        <div className="relative">
          <Card className="absolute w-full bottom-4">
            <CardHeader>
              <CardTitle className="text-center">
                Ciao! Inserisci il tuo token di CarbonQuest per iniziare a
                monitorare i tuoi dati
              </CardTitle>
            </CardHeader>
          </Card>

          <img
            className="mx-auto"
            src={mascotte}
            alt="Ophelia"
            width={250}
            height={250}
            draggable={false}
          />
        </div>

        <div className="flex gap-2">
          <Input
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Inserisci il tuo token"
          />

          <Button
            onClick={async () => {
              await storage.setItem("local:api-key", key);
              setSetup(true);
            }}
          >
            Salva
          </Button>
        </div>

        <Button asChild className="mt-2 w-full" variant="outline">
          <a
            href="https://hackathon.apps.lorenzoc.dev/dashboard?showToken"
            target="_blank"
          >
            Ottieni un token
          </a>
        </Button>
      </main>
    );

  // Se è configurato, mostra il bottone per aprire la dashboard
  return (
    <main>
      <div className="relative">
        <Card className="absolute w-full bottom-4">
          <CardHeader>
            <CardTitle className="text-center">
              Ciao! Sto monitorando i tuoi consumi
            </CardTitle>
          </CardHeader>
        </Card>

        <img
          className="mx-auto"
          src={mascotte}
          alt="Ophelia"
          width={250}
          height={250}
          draggable={false}
        />
      </div>

      <div className="flex gap-2">
        <Button asChild className="w-full" variant="outline">
          <a
            href="https://hackathon.apps.lorenzoc.dev/dashboard"
            target="_blank"
          >
            Apri la dashboard
          </a>
        </Button>
        <Button
          className="w-full"
          onClick={async () => {
            // Rimuovi la chiave API dallo storage del browser
            await storage.removeItem("local:api-key");
            setSetup(false);
            setKey("");
          }}
        >
          Logout
        </Button>
      </div>
    </main>
  );
}

export default App;
