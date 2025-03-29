import mascotte from "@/assets/mascotte-0.png";

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
        <div className="mascotte-dialog">
          <p className="dialog">
            Ciao! Inserisci il tuo token di CarbonQuest per iniziare a
            monitorare i tuoi dati
          </p>
          <img src={mascotte} alt="Mascotte" width={100} />
        </div>

        <input
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Inserisci il tuo token"
        />

        <button
          onClick={async () => {
            await storage.setItem("local:api-key", key);
            setSetup(true);
          }}
        >
          Salva
        </button>
      </main>
    );

  // Se è configurato, mostra il bottone per aprire la dashboard
  return (
    <main>
      <h1>CarbonQuest</h1>

      <button>Apri la dashboard</button>
    </main>
  );
}

export default App;
