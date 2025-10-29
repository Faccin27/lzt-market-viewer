import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
          <h2 className="text-2xl font-bold mb-2">Item não encontrado</h2>
          <p className="text-muted-foreground mb-6">
            O item que você está procurando não existe ou não está disponível.
          </p>
          <Button asChild>
            <a href="/">Voltar para a busca</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
