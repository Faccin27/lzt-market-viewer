"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, User, Zap } from "lucide-react"

export function InventoryImage({ itemId, type, title }: { itemId: string; type: string; title: string }) {
  return (
    <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm overflow-hidden">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          {type === "weapons" && <Target className="h-6 w-6 text-primary" />}
          {type === "agents" && <User className="h-6 w-6 text-primary" />}
          {type === "buddies" && <Zap className="h-6 w-6 text-primary" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative rounded-lg overflow-hidden border-2 border-primary/20 bg-background/50">
          <img
            src={`/api/image/${itemId}/${type}`}
            alt={title}
            className="w-full h-auto"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              const card = target.closest(".border-2")
              if (card?.parentElement?.parentElement) {
                card.parentElement.parentElement.style.display = "none"
              }
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
