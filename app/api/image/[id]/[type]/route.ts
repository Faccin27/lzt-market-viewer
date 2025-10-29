import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string; type: string }> }) {
  const { id, type } = await params

  const allowedTypes = ["skins", "pickaxes", "dances", "gliders", "weapons", "agents", "buddies"]

  if (!allowedTypes.includes(type)) {
    return NextResponse.json({ error: "Invalid image type" }, { status: 400 })
  }

  try {
    const token = process.env.LZT_MARKET_TOKEN

    if (!token) {
      return NextResponse.json({ error: "LZT_MARKET_TOKEN não configurado" }, { status: 500 })
    }

    const response = await fetch(`https://prod-api.lzt.market/${id}/image?type=${type}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "image/*",
      },
      cache: "force-cache",
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Imagem não encontrada" }, { status: response.status })
    }

    const imageBuffer = await response.arrayBuffer()
    const contentType = response.headers.get("content-type") || "image/png"

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar imagem" }, { status: 500 })
  }
}
