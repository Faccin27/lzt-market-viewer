"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Loader2 } from "lucide-react"
import Image from "next/image"

interface Buddy {
  uuid: string
  displayName: string
  displayIcon: string | null
}

interface BuddiesDisplayProps {
  buddyIds: string[]
}

export function BuddiesDisplay({ buddyIds }: BuddiesDisplayProps) {
  const [buddies, setBuddies] = useState<Buddy[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBuddies() {
      if (!buddyIds || buddyIds.length === 0) {
        setLoading(false)
        return
      }

      try {
        console.log("[v0] Client: Fetching buddies for", buddyIds.length, "IDs")
        const response = await fetch("/api/valorant/buddies", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ buddyIds }),
        })

        if (!response.ok) {
          throw new Error("Failed to fetch buddies")
        }
        const data = await response.json()
        console.log("[v0] Client: Received", data.buddies?.length || 0, "buddies")
        setBuddies(data.buddies || [])
      } catch (err) {
        console.error("[v0] Client: Error loading buddies:", err)
        setError("Erro ao carregar buddies")
      } finally {
        setLoading(false)
      }
    }

    fetchBuddies()
  }, [buddyIds])

  if (loading) {
    return (
      <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            Chaveiros (Buddies)
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

  if (error || buddies.length === 0) {
    return null
  }

  return (
    <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary" />
          Chaveiros (Buddies)
          <span className="text-sm font-normal text-muted-foreground ml-2">({buddies.length} buddies)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {buddies.map((buddy) => (
            <div
              key={buddy.uuid}
              className="group relative p-3 bg-background/50 rounded-lg border border-primary/10 hover:border-primary/30 transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
            >
              <div className="aspect-square relative mb-2 bg-background/30 rounded flex items-center justify-center overflow-hidden">
                {buddy.displayIcon ? (
                  <Image
                    src={buddy.displayIcon || "/placeholder.svg"}
                    alt={buddy.displayName}
                    fill
                    className="object-contain p-2"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = "none"
                    }}
                  />
                ) : (
                  <Heart className="h-8 w-8 text-muted-foreground/30" />
                )}
              </div>
              <div className="text-xs font-medium text-center text-balance leading-tight line-clamp-2">
                {buddy.displayName}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
