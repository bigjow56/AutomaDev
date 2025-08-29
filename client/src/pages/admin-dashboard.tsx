import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Plus, 
  Edit, 
  Trash2, 
  LogOut, 
  Calendar, 
  Clock, 
  Eye,
  Power,
  PowerOff,
  Loader2,
  Settings,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Event } from "@shared/schema";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const eventFormSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  endDate: z.string().optional(),
  isActive: z.string().default("false"),
});

type EventForm = z.infer<typeof eventFormSchema>;

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const queryClient = useQueryClient();

  // Check if admin is authenticated
  const { data: authCheck, isLoading: authLoading } = useQuery<{ success: boolean; isAdmin: boolean }>({
    queryKey: ["/api/admin/check"],
    retry: false,
  });

  // Fetch events
  const { data: eventsData, isLoading: eventsLoading } = useQuery<{ success: boolean; events: Event[] }>({
    queryKey: ["/api/admin/events"],
    enabled: !!authCheck?.isAdmin,
  });

  const events = eventsData?.events || [];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EventForm>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      isActive: "false"
    }
  });

  // Event templates
  const templates = {
    webinar: {
      title: "Webinar Gratuito: Automação de Processos",
      subtitle: "Aprenda a automatizar seus processos em 60 minutos",
      description: "Neste webinar exclusivo, você vai descobrir como automatizar processos repetitivos em sua empresa, economizando tempo e reduzindo erros. Ideal para empreendedores e gestores que querem otimizar suas operações.",
    },
    workshop: {
      title: "Workshop: Transformação Digital",
      subtitle: "2 dias de imersão em tecnologia",
      description: "Workshop prático sobre como implementar soluções digitais em sua empresa. Inclui cases reais, ferramentas práticas e networking com outros empresários.",
    },
    consultoria: {
      title: "Consultoria Gratuita: Análise de Processos",
      subtitle: "30 minutos para revolucionar seu negócio",
      description: "Sessão de consultoria gratuita para identificar gargalos em seus processos e propor soluções de automação personalizadas para seu negócio.",
    }
  };

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/admin/logout");
    },
    onSuccess: () => {
      queryClient.clear();
      setLocation("/admin/login");
    },
  });

  // Create event mutation
  const createEventMutation = useMutation({
    mutationFn: async (data: EventForm) => {
      return await apiRequest("POST", "/api/admin/events", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/events"] });
      setIsDialogOpen(false);
      reset();
      setSelectedTemplate("");
    },
  });

  // Update event mutation
  const updateEventMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: EventForm }) => {
      return await apiRequest("PUT", `/api/admin/events/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/events"] });
      setIsDialogOpen(false);
      setEditingEvent(null);
      reset();
    },
  });

  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/admin/events/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/events"] });
    },
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !authCheck?.isAdmin) {
      setLocation("/admin/login");
    }
  }, [authCheck, authLoading, setLocation]);

  const onSubmit = (data: EventForm) => {
    if (editingEvent) {
      updateEventMutation.mutate({ id: editingEvent.id, data });
    } else {
      createEventMutation.mutate(data);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setValue("title", event.title);
    setValue("subtitle", event.subtitle || "");
    setValue("description", event.description || "");
    setValue("endDate", event.endDate ? format(new Date(event.endDate), "yyyy-MM-dd'T'HH:mm") : "");
    setValue("isActive", event.isActive);
    setIsDialogOpen(true);
  };

  const handleNewEvent = () => {
    setEditingEvent(null);
    reset();
    setSelectedTemplate("");
    setIsDialogOpen(true);
  };

  const handleTemplateSelect = (templateKey: string) => {
    const template = templates[templateKey as keyof typeof templates];
    if (template) {
      setValue("title", template.title);
      setValue("subtitle", template.subtitle);
      setValue("description", template.description);
      setSelectedTemplate(templateKey);
    }
  };

  const toggleEventStatus = (event: Event) => {
    const newStatus = event.isActive === "true" ? "false" : "true";
    updateEventMutation.mutate({
      id: event.id,
      data: {
        title: event.title,
        subtitle: event.subtitle || undefined,
        description: event.description || undefined,
        endDate: event.endDate ? format(new Date(event.endDate), "yyyy-MM-dd'T'HH:mm") : undefined,
        isActive: newStatus,
      }
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!authCheck?.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#FF6B35] to-[#F7931E] rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Dashboard Admin</h1>
            </div>
            <Button
              variant="outline"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className="flex items-center space-x-2"
              data-testid="admin-logout-button"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-[#FF6B35]" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de Eventos</p>
                  <p className="text-2xl font-bold text-gray-900">{events.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Power className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Eventos Ativos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {events.filter((event: Event) => event.isActive === "true").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <PowerOff className="w-8 h-8 text-gray-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Eventos Inativos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {events.filter((event: Event) => event.isActive === "false").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Events Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Gerenciar Eventos</CardTitle>
                <CardDescription>
                  Crie, edite e ative eventos para exibir no site
                </CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={handleNewEvent}
                    className="bg-gradient-to-r from-[#FF6B35] to-[#F7931E] hover:from-[#e55a2b] hover:to-[#e0851a]"
                    data-testid="admin-new-event-button"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Evento
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingEvent ? "Editar Evento" : "Criar Novo Evento"}
                    </DialogTitle>
                    <DialogDescription>
                      Preencha as informações do evento abaixo
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Templates */}
                    {!editingEvent && (
                      <div className="space-y-2">
                        <Label>Templates Prontos (Opcional)</Label>
                        <div className="grid grid-cols-1 gap-2">
                          {Object.entries(templates).map(([key, template]) => (
                            <Button
                              key={key}
                              type="button"
                              variant={selectedTemplate === key ? "default" : "outline"}
                              className="text-left h-auto p-3"
                              onClick={() => handleTemplateSelect(key)}
                            >
                              <div>
                                <div className="font-medium">{template.title}</div>
                                <div className="text-sm text-gray-600">{template.subtitle}</div>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="title">Título *</Label>
                      <Input
                        id="title"
                        {...register("title")}
                        placeholder="Ex: Webinar Gratuito sobre Automação"
                        data-testid="event-title-input"
                      />
                      {errors.title && (
                        <p className="text-sm text-red-600">{errors.title.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subtitle">Subtítulo</Label>
                      <Input
                        id="subtitle"
                        {...register("subtitle")}
                        placeholder="Ex: Aprenda em 60 minutos"
                        data-testid="event-subtitle-input"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        {...register("description")}
                        placeholder="Descreva o evento, benefícios e informações importantes..."
                        rows={4}
                        data-testid="event-description-input"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endDate">Data e Hora de Término</Label>
                      <Input
                        id="endDate"
                        type="datetime-local"
                        {...register("endDate")}
                        data-testid="event-enddate-input"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isActive"
                        checked={watch("isActive") === "true"}
                        onCheckedChange={(checked) => setValue("isActive", checked ? "true" : "false")}
                        data-testid="event-active-switch"
                      />
                      <Label htmlFor="isActive">Evento ativo (visível no site)</Label>
                    </div>

                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        disabled={createEventMutation.isPending || updateEventMutation.isPending}
                        className="bg-gradient-to-r from-[#FF6B35] to-[#F7931E] hover:from-[#e55a2b] hover:to-[#e0851a]"
                        data-testid="event-save-button"
                      >
                        {(createEventMutation.isPending || updateEventMutation.isPending) ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          editingEvent ? "Atualizar" : "Criar"
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>

          <CardContent>
            {eventsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="ml-2">Carregando eventos...</span>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum evento criado
                </h3>
                <p className="text-gray-600 mb-4">
                  Crie seu primeiro evento para começar
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((event: Event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {event.title}
                          </h3>
                          {event.isActive === "true" ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Ativo
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              <PowerOff className="w-3 h-3 mr-1" />
                              Inativo
                            </span>
                          )}
                        </div>
                        {event.subtitle && (
                          <p className="text-gray-600 mb-2">{event.subtitle}</p>
                        )}
                        {event.description && (
                          <p className="text-gray-700 mb-2 line-clamp-2">{event.description}</p>
                        )}
                        {event.endDate && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-1" />
                            Termina em {format(new Date(event.endDate), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleEventStatus(event)}
                          disabled={updateEventMutation.isPending}
                          data-testid={`event-toggle-${event.id}`}
                        >
                          {event.isActive === "true" ? (
                            <PowerOff className="w-4 h-4" />
                          ) : (
                            <Power className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(event)}
                          data-testid={`event-edit-${event.id}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteEventMutation.mutate(event.id)}
                          disabled={deleteEventMutation.isPending}
                          className="text-red-600 hover:text-red-700"
                          data-testid={`event-delete-${event.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}