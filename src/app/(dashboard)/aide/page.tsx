"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export default function AidePage() {
  return (
    <main className="max-w-4xl mx-auto py-10 px-4 space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-full bg-orange-100 text-orange-600">
          <HelpCircle className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Centre d’aide</h1>
          <p className="text-gray-600">
            Trouvez des réponses à vos questions fréquentes.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Questions fréquentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger>
                Comment ajouter un aliment à mon frigo ?
              </AccordionTrigger>
              <AccordionContent>
                Allez dans l’onglet “Mon Frigo”, remplissez le formulaire avec
                le nom, la quantité et la date d’expiration, puis cliquez sur
                “Ajouter”.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q2">
              <AccordionTrigger>
                Comment sont générées les recettes ?
              </AccordionTrigger>
              <AccordionContent>
                Les recettes sont générées à partir des aliments que vous avez
                ajoutés dans votre frigo. L'application utilise une intelligence
                artificielle pour vous proposer des idées adaptées.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q3">
              <AccordionTrigger>
                Est-ce que mes données sont sauvegardées ?
              </AccordionTrigger>
              <AccordionContent>
                Oui, vos aliments et préférences sont sauvegardés de manière
                sécurisée dans votre compte via Firebase.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q4">
              <AccordionTrigger>Est-ce que c’est gratuit ?</AccordionTrigger>
              <AccordionContent>
                Oui, l'utilisation de Frigoo est 100% gratuite. Certaines
                fonctionnalités premium pourraient arriver dans le futur.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </main>
  );
}
