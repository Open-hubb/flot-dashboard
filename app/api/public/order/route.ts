import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { z } from "zod"

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}

const bodySchema = z.object({
  merchantId: z.string(),
  name: z.string().min(1),
  phone: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  items: z.array(
    z.object({
      name: z.string(),
      size: z.string(),
      qty: z.number().int().positive(),
      price: z.number().nonnegative(),
    })
  ).min(1),
  total: z.number().positive(),
  currency: z.string().default("NLE"),
})

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400, headers: CORS })
  }

  const { merchantId, name, phone, address, city, items, total, currency } = parsed.data

  const merchant = await db.merchant.findUnique({
    where: { flotMerchantId: merchantId },
    select: { id: true, type: true },
  })

  if (!merchant || merchant.type !== "WEBSITE") {
    return NextResponse.json({ error: "Merchant not found" }, { status: 404, headers: CORS })
  }

  const customerOrder = await db.customerOrder.create({
    data: {
      merchantId: merchant.id,
      name,
      phone,
      address,
      city,
      items,
      total,
      currency,
    },
  })

  return NextResponse.json({ ok: true, orderId: customerOrder.id }, { status: 201, headers: CORS })
}
