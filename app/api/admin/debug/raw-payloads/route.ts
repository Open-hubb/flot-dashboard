import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getAdminCookieValue, ADMIN_COOKIE } from "@/lib/admin-auth"

function isAdmin(req: NextRequest) {
  return req.cookies.get(ADMIN_COOKIE)?.value === getAdminCookieValue()
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const orders = await db.order.findMany({
    orderBy: { receivedAt: "desc" },
    take: 5,
    select: {
      id: true,
      orderId: true,
      flotRequestId: true,
      status: true,
      receivedAt: true,
      rawPayload: true,
      merchant: { select: { businessName: true, flotMerchantId: true } },
    },
  })

  return NextResponse.json(orders, { status: 200 })
}
