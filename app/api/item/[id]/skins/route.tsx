import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const token = process.env.LZT_MARKET_TOKEN

    if (!token) {
      return NextResponse.json({ error: "Token not configured" }, { status: 500 })
    }

    // Fetch account data from LZT Market
    const accountResponse = await fetch(`https://prod-api.lzt.market/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    })

    if (!accountResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch account data" }, { status: accountResponse.status })
    }

    const accountData = await accountResponse.json()
    const weaponSkinIds = accountData.item?.valorantInventory?.WeaponSkins || []

    if (weaponSkinIds.length === 0) {
      return NextResponse.json({ skins: [] })
    }

    // Fetch all Valorant skins from Valorant API
    const valorantResponse = await fetch("https://valorant-api.com/v1/weapons/skins", {
      cache: "force-cache",
    })

    if (!valorantResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch Valorant skins" }, { status: valorantResponse.status })
    }

    const valorantData = await valorantResponse.json()
    const allSkins = valorantData.data || []

    // Filter skins that exist in the account
    const accountSkins = allSkins
      .filter((skin: any) => weaponSkinIds.includes(skin.uuid))
      .map((skin: any) => ({
        uuid: skin.uuid,
        displayName: skin.displayName,
        displayIcon: skin.displayIcon,
        contentTierUuid: skin.contentTierUuid,
      }))

    return NextResponse.json({ skins: accountSkins })
  } catch (error) {
    console.error("[v0] Error fetching skins:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
