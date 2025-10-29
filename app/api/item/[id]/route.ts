import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  console.log("[v0] API: Received request for item ID:", id)

  try {
    const token = process.env.LZT_MARKET_TOKEN

    if (!token) {
      console.error("[v0] API: LZT_MARKET_TOKEN not configured")
      return NextResponse.json({ error: "LZT_MARKET_TOKEN não configurado" }, { status: 500 })
    }

    console.log("[v0] API: Token found, length:", token.length)

    const url = `https://prod-api.lzt.market/managing/${id}`
    console.log("[v0] API: Fetching from URL:", url)

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    })

    console.log("[v0] API: LZT Market response status:", response.status)
    console.log("[v0] API: LZT Market response headers:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] API: LZT Market error response:", errorText)
      return NextResponse.json({ error: "Item não encontrado na API do LZT Market" }, { status: response.status })
    }

    const data = await response.json()
    console.log("[v0] API: Successfully fetched item data, keys:", Object.keys(data))
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] API: Exception occurred:", error)
    return NextResponse.json(
      { error: "Erro ao buscar item: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 },
    )
  }
}
