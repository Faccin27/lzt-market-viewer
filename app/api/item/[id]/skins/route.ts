import { type NextRequest, NextResponse } from "next/server"

const RARITY_ORDER: Record<string, number> = {
  "e046854e-406c-37f4-6607-19a9ba8426fc": 1, // Ultra Edition
  "60bca009-4182-7998-dee7-b8a2558dc369": 2, // Exclusive Edition
  "12683d76-48d7-84a3-4e09-6985794f0445": 3, // Premium Edition
  "0cebb8be-46d7-c12a-d306-e9907bfc5a25": 4, // Deluxe Edition
  "411e4a55-4e59-7757-41f0-86a53f101bb5": 5, // Select Edition
}

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
      .sort((a: any, b: any) => {
        const rarityA = RARITY_ORDER[a.contentTierUuid] || 999
        const rarityB = RARITY_ORDER[b.contentTierUuid] || 999
        return rarityA - rarityB
      })

    return NextResponse.json({ skins: accountSkins })
  } catch (error) {
    console.error("[v0] Error fetching skins:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
