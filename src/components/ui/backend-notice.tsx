import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, ExternalLink } from "lucide-react";

interface BackendNoticeProps {
  feature: string;
}

export function BackendNotice({ feature }: BackendNoticeProps) {
  return (
    <Alert className="border-orange-200 bg-orange-50">
      <AlertCircle className="h-4 w-4 text-orange-600" />
      <AlertTitle className="text-orange-800">Backend Necessário</AlertTitle>
      <AlertDescription className="text-orange-700">
        A funcionalidade <strong>{feature}</strong> requer que o backend esteja acessível no Render.
        Use o arquivo <code>BACKEND_PROFILE_PROMPT.md</code> para implementar os endpoints necessários.
        
        <div className="mt-3 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('https://style-back-end.onrender.com/api', '_blank')}
            className="text-orange-700 border-orange-300 hover:bg-orange-100"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Testar Backend
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
