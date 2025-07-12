import BankSummary from "@/components/widgets/BankSummary";
import { IncomesSummary } from "@/components/widgets/IncomesSummary";
import { MemberSummary } from "@/components/widgets/MemberSummary";


export default function DashboardPage() {

return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Vue d'ensemble sur le mois en cours</h2>

      {/* Solde */}
      <div className="rounded-xl border p-6 shadow-sm bg-white">
        <p className="text-sm text-muted-foreground">Solde disponible</p>
        <p className="text-3xl font-bold text-green-600">1 850,00 €</p>
      </div>

      {/* Répartition */}
      <div className="rounded-xl border p-6 shadow-sm bg-white">
        <p className="text-sm text-muted-foreground mb-2">Répartition du budget</p>
        <ul className="grid grid-cols-2 gap-2 text-sm">
          <li>Vital : <strong>653.20€</strong></li>
          <li>Voiture : <strong>210.00€</strong></li>
          <li>Loisirs : <strong>310.54€</strong></li>
          <li>Épargne : <strong>216.54€</strong></li>
        </ul>
      </div>

      {/* Budget du mois */}
      <div className="rounded-xl border p-6 shadow-sm bg-white">
        <p className="text-sm text-muted-foreground">Budget de juillet 2025</p>
        <p className="text-xl font-semibold">2 400,00 € affectés sur 2 600,00 €</p>
      </div>

      {/* Actions rapides */}
      <div className="rounded-xl border p-6 shadow-sm bg-white flex gap-4">
        <button className="bg-black text-white px-4 py-2 rounded-lg text-sm">
          Ajouter un revenu
        </button>
        <button className="bg-muted px-4 py-2 rounded-lg text-sm">
          Ajouter une charge
        </button>
      </div>
      {/* Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MemberSummary />
        <BankSummary />
        <IncomesSummary />
        {/* Other widgets can be added here */}
      </div>
    </section>
  )
}
