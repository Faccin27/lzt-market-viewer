"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Loader2 } from "lucide-react"
import Image from "next/image"

interface Skin {
  uuid: string
  displayName: string
  displayIcon: string | null
  contentTierUuid: string
}

interface WeaponSkinsDisplayProps {
  skinIds: string[]
}

export function WeaponSkinsDisplay({ skinIds }: WeaponSkinsDisplayProps) {
  const [skins, setSkins] = useState<Skin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSkins() {
      if (!skinIds || skinIds.length === 0) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch("/api/valorant/skins", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ skinIds }),
        })

        if (!response.ok) {
          throw new Error("Failed to fetch skins")
        }
        const data = await response.json()
        setSkins(data.skins || [])
      } catch (err) {
        console.error("[v0] Client: Error loading skins:", err)
        setError("Erro ao carregar skins")
      } finally {
        setLoading(false)
      }
    }

    fetchSkins()
  }, [skinIds])

  if (loading) {
    return (
      <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Skins de Armas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || skins.length === 0) {
    return null
  }

  return (
    <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Target className="h-6 w-6 text-primary" />
          Skins de Armas
          <span className="text-sm font-normal text-muted-foreground ml-2">({skins.length} skins)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {skins.map((skin) => (
            <div
              key={skin.uuid}
              className="group relative p-3 bg-background/50 rounded-lg border border-primary/10 hover:border-primary/30 transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
            >
              <div className="aspect-4/3 relative mb-2 bg-background/30 rounded flex items-center justify-center overflow-hidden">
                {skin.displayIcon ? (
                  <Image
                    src={skin.displayIcon || "/placeholder.svg"}
                    alt={skin.displayName}
                    fill
                    className="object-contain p-2"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = "none"
                    }}
                  />
                ) : (
                  <Target className="h-8 w-8 text-muted-foreground/30" />
                )}
              </div>
              <div className="text-xs font-medium text-center text-balance leading-tight line-clamp-2">
                {skin.displayName}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
