import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const { merchantId, page, referrer } = body ?? {}

  if (!merchantId || !page) {
    return NextResponse.json({ error: "merchantId and page are required" }, { status: 400, headers: CORS })
  }

  const merchant = await db.merchant.findUnique({
    where: { flotMerchantId: merchantId },
    select: { id: true, type: true },
  })

  if (!merchant || merchant.type !== "WEBSITE") {
    return NextResponse.json({ error: "Not found" }, { status: 404, headers: CORS })
  }

  await db.websiteAnalyticsEvent.create({
    data: {
      merchantId: merchant.id,
      page: String(page).slice(0, 500),
      referrer: referrer ? String(referrer).slice(0, 500) : null,
    },
  })

  return NextResponse.json({ ok: true }, { headers: CORS })
}
