import { Card, CardContent } from "../ui/card";

type Props = {
    label: string ;
    value: string ;
    sub?: string ;
    tone?: "pos" | "neg" | "muted"
}

export default function KpiCard({label, value, sub, tone = "muted"}:Props ) {
    const toneCls = 
        tone === "pos" ? "text-emerald-600 dark:text-emerald-400" :
        tone === "neg" ? "text-rose-600 dark:text-rose-400" :
        "text-foreground";

return (
    <Card>
        <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className={`text-xl font-semibold ${toneCls}`}>{value}</div>
            {sub ? <div className="text-xs text-muted-foreground mt-1">{sub}</div> : null}
        </CardContent>
    </Card>
)

}