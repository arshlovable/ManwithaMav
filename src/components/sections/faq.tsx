import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/content/faq";

export function Faq() {
  const midpoint = Math.ceil(faqs.length / 2);
  const columns = [faqs.slice(0, midpoint), faqs.slice(midpoint)];

  return (
    <section id="faq" aria-labelledby="faq-heading" className="bg-mav-cream text-mav-black">
      <div className="container-mav py-16 md:py-24">
        <h2
          id="faq-heading"
          className="eyebrow-bar font-heading text-[clamp(2rem,4.5vw,3.25rem)] leading-none"
        >
          Frequently asked questions
        </h2>

        <div className="mt-10 grid gap-x-6 gap-y-3 md:grid-cols-2">
          {columns.map((column, colIndex) => (
            <Accordion key={colIndex} type="single" collapsible className="gap-3">
              {column.map((item, i) => (
                <AccordionItem
                  key={item.question}
                  value={`faq-${colIndex}-${i}`}
                  className="rounded-xl border border-mav-black/15 bg-white px-5 not-last:border-b"
                >
                  <AccordionTrigger className="py-4 text-left text-base font-semibold hover:no-underline **:data-[slot=accordion-trigger-icon]:size-5 **:data-[slot=accordion-trigger-icon]:text-mav-black">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-sm leading-relaxed text-mav-black/75 sm:text-base">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  );
}
