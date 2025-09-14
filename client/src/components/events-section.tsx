import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Event } from "@shared/schema";
import { format, isPast } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function EventsSection() {
  const { data: eventsData, isLoading } = useQuery<{ success: boolean; events: Event[] }>({
    queryKey: ["/api/events"],
  });

  const events = eventsData?.events || [];

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Próximos Eventos
            </h2>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-600 dark:text-gray-300">Carregando eventos...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return null; // Don't show section if no events
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Próximos Eventos
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Participe dos nossos eventos exclusivos e aprenda as melhores práticas em automação de processos
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => {
            const isExpired = event.endDate ? isPast(new Date(event.endDate)) : false;
            
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-200 border-0 shadow-md">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-2">
                      <Badge
                        variant={isExpired ? "secondary" : "default"}
                        className={
                          isExpired
                            ? "bg-gray-100 text-gray-600"
                            : "bg-gradient-to-r from-purple-600 to-purple-500 text-white"
                        }
                      >
                        {isExpired ? "Encerrado" : "Disponível"}
                      </Badge>
                      <Calendar className="w-5 h-5 text-purple-600" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {event.title}
                    </CardTitle>
                    {event.subtitle && (
                      <CardDescription className="text-gray-600 dark:text-gray-300 font-medium">
                        {event.subtitle}
                      </CardDescription>
                    )}
                  </CardHeader>

                  <CardContent className="pb-6">
                    {event.description && (
                      <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                        {event.description}
                      </p>
                    )}

                    {event.endDate && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>
                          {isExpired
                            ? `Encerrou em ${format(new Date(event.endDate), "dd 'de' MMMM", { locale: ptBR })}`
                            : `Até ${format(new Date(event.endDate), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}`
                          }
                        </span>
                      </div>
                    )}

                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
                      <Users className="w-4 h-4 mr-2" />
                      <span>Vagas limitadas</span>
                    </div>

                    <Button
                      className={`w-full ${
                        isExpired
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white"
                      } transition-all duration-200`}
                      disabled={isExpired}
                      data-testid={`event-cta-${event.id}`}
                    >
                      {isExpired ? (
                        "Evento Encerrado"
                      ) : (
                        <>
                          Saiba Mais
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Quer receber notificações sobre novos eventos?
          </p>
          <Button
            variant="outline"
            className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
            data-testid="events-notify-button"
          >
            Receber Notificações
          </Button>
        </motion.div>
      </div>
    </section>
  );
}