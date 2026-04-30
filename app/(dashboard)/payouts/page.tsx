import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { CheckCircle2, Mail, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function PayoutsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const completedCount = await db.order.count({
    where: { merchantId: session.user.id, status: "COMPLETED" },
  })

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Completed payments stat */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Completed Payments</p>
            <p className="text-2xl font-bold">{completedCount.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
        <h2 className="text-base font-semibold">Request a Payout</h2>

        <div className="flex gap-3 rounded-lg bg-muted p-4 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0 text-muted-foreground mt-0.5" />
          <p className="text-muted-foreground">
            Payouts are processed by the Flot team. Contact your account manager to initiate a
            payout. Payouts are typically processed within 2–5 business days.
          </p>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">What to include in your payout request:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Your business name and Merchant ID</li>
            <li>The amount you&apos;d like to withdraw</li>
            <li>Your preferred bank account details</li>
          </ul>
        </div>

        <a href="mailto:support@flotme.ai?subject=Payout%20Request">
          <Button className="w-full sm:w-auto">
            <Mail className="mr-2 h-4 w-4" />
            Contact Flot Support
          </Button>
        </a>
      </div>

      {/* Merchant ID for reference */}
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <p className="text-xs text-muted-foreground">Your Merchant ID (include in payout request)</p>
        <p className="mt-1 font-mono text-sm font-medium">
          {(session.user as any).flotMerchantId ?? "—"}
        </p>
      </div>
    </div>
  )
}
