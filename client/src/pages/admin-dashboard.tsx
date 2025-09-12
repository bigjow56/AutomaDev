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
import { Event, Project } from "@shared/schema";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, ShoppingCart, BarChart3, Image, Upload } from "lucide-react";

const eventFormSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  subtitle: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  endDate: z.string().optional().or(z.literal("")),
  isActive: z.enum(["true", "false"]).default("false"),
});

const projectFormSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  category: z.string().min(1, "Categoria é obrigatória"),
  categoryColor: z.string().optional().or(z.literal("")),
  icon: z.string().optional().or(z.literal("")),
  tags: z.string().min(1, "Pelo menos uma tag é obrigatória"),
  metric: z.string().min(1, "Métrica é obrigatória"),
  images: z.string().optional().or(z.literal("")),
  isActive: z.enum(["true", "false"]).default("true"),
  sortOrder: z.string().optional().or(z.literal("")),
});

type EventForm = z.infer<typeof eventFormSchema>;
type ProjectForm = z.infer<typeof projectFormSchema>;

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [activeTab, setActiveTab] = useState("events");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [projectImages, setProjectImages] = useState<{url: string, type: "uploaded" | "url", alt: string}[]>([]);
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

  // Fetch projects
  const { data: projectsData, isLoading: projectsLoading } = useQuery<{ success: boolean; projects: Project[] }>({
    queryKey: ["/api/admin/projects"],
    enabled: !!authCheck?.isAdmin,
  });

  const events = eventsData?.events || [];
  const projects = projectsData?.projects || [];

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

  const {
    register: registerProject,
    handleSubmit: handleSubmitProject,
    reset: resetProject,
    setValue: setValueProject,
    watch: watchProject,
    formState: { errors: errorsProject },
  } = useForm<ProjectForm>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      isActive: "true",
      categoryColor: "bg-primary",
      icon: "Building",
      sortOrder: "0"
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
      console.log("=== MUTATION SENDING DATA ===");
      console.log("Data being sent:", JSON.stringify(data, null, 2));
      return await apiRequest("POST", "/api/admin/events", data);
    },
    onSuccess: (result) => {
      console.log("=== CREATE SUCCESS ===");
      console.log("Result:", result);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/events"] });
      setIsEventDialogOpen(false);
      reset();
      setSelectedTemplate("");
    },
    onError: (error) => {
      console.error("=== CREATE ERROR ===");
      console.error("Error:", error);
    },
  });

  // Update event mutation
  const updateEventMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: EventForm }) => {
      return await apiRequest("PUT", `/api/admin/events/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/events"] });
      setIsEventDialogOpen(false);
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

  // Image upload mutation
  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Erro no upload da imagem');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      const newImage = {
        url: data.imageUrl,
        type: "uploaded" as const,
        alt: `Imagem do projeto ${watchProject("title") || ""}`.trim()
      };
      setProjectImages(prev => [...prev, newImage]);
      updateProjectImagesField();
    },
  });

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: async (data: ProjectForm) => {
      return await apiRequest("POST", "/api/admin/projects", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      setIsProjectDialogOpen(false);
      resetProject();
    },
  });

  // Update project mutation
  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ProjectForm }) => {
      return await apiRequest("PUT", `/api/admin/projects/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      setIsProjectDialogOpen(false);
      setEditingProject(null);
      resetProject();
    },
  });

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/admin/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
    },
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !authCheck?.isAdmin) {
      setLocation("/admin/login");
    }
  }, [authCheck, authLoading, setLocation]);

  const onSubmit = (data: EventForm) => {
    console.log("=== FRONTEND FORM SUBMIT ===");
    console.log("Form data:", JSON.stringify(data, null, 2));
    console.log("Form errors:", errors);
    
    if (editingEvent) {
      updateEventMutation.mutate({ id: editingEvent.id, data });
    } else {
      createEventMutation.mutate(data);
    }
  };

  const onSubmitProject = (data: ProjectForm) => {
    if (editingProject) {
      updateProjectMutation.mutate({ id: editingProject.id, data });
    } else {
      createProjectMutation.mutate(data);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingImage(true);
      uploadImageMutation.mutate(file, {
        onSettled: () => setUploadingImage(false),
      });
    }
    // Reset input
    e.target.value = '';
  };

  const handleAddImageByUrl = () => {
    if (imageUrlInput.trim()) {
      const newImage = {
        url: imageUrlInput.trim(),
        type: "url" as const,
        alt: `Imagem do projeto ${watchProject("title") || ""}`.trim()
      };
      setProjectImages(prev => [...prev, newImage]);
      setImageUrlInput("");
      updateProjectImagesField();
    }
  };

  const handleRemoveImage = (index: number) => {
    setProjectImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      // Update form field
      setValueProject('images', JSON.stringify(newImages));
      return newImages;
    });
  };

  const updateProjectImagesField = () => {
    // Use setTimeout to ensure projectImages state is updated
    setTimeout(() => {
      setValueProject('images', JSON.stringify(projectImages));
    }, 0);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setValue("title", event.title);
    setValue("subtitle", event.subtitle || "");
    setValue("description", event.description || "");
    setValue("endDate", event.endDate ? format(new Date(event.endDate), "yyyy-MM-dd'T'HH:mm") : "");
    setValue("isActive", event.isActive);
    setIsEventDialogOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setValueProject("title", project.title);
    setValueProject("description", project.description);
    setValueProject("category", project.category);
    setValueProject("categoryColor", project.categoryColor || "bg-primary");
    setValueProject("icon", project.icon || "Building");
    setValueProject("tags", project.tags);
    setValueProject("metric", project.metric);
    
    // Load existing images
    try {
      const existingImages = project.images ? JSON.parse(project.images) : [];
      setProjectImages(existingImages);
      setValueProject("images", project.images || "[]");
    } catch (error) {
      console.error("Error parsing project images:", error);
      setProjectImages([]);
      setValueProject("images", "[]");
    }
    
    setValueProject("isActive", project.isActive as "true" | "false");
    setValueProject("sortOrder", project.sortOrder || "0");
    setIsProjectDialogOpen(true);
  };

  const handleNewEvent = () => {
    setEditingEvent(null);
    reset();
    setSelectedTemplate("");
    setIsEventDialogOpen(true);
  };

  const handleNewProject = () => {
    setEditingProject(null);
    resetProject();
    setProjectImages([]);
    setImageUrlInput("");
    setIsProjectDialogOpen(true);
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
        isActive: newStatus as "true" | "false",
      }
    });
  };

  const toggleProjectStatus = (project: Project) => {
    const newStatus = project.isActive === "true" ? "false" : "true";
    updateProjectMutation.mutate({
      id: project.id,
      data: {
        title: project.title,
        description: project.description,
        category: project.category,
        categoryColor: project.categoryColor || "bg-primary",
        icon: project.icon || "Building",
        tags: project.tags,
        metric: project.metric,
        images: project.images || "[]",
        isActive: newStatus as "true" | "false",
        sortOrder: project.sortOrder || "0",
      }
    });
  };

  // Icon options
  const iconOptions = [
    { value: "Building", label: "Edifício", icon: <Building className="w-4 h-4" /> },
    { value: "ShoppingCart", label: "Carrinho", icon: <ShoppingCart className="w-4 h-4" /> },
    { value: "BarChart3", label: "Gráfico", icon: <BarChart3 className="w-4 h-4" /> },
  ];

  // Category color options
  const colorOptions = [
    { value: "bg-primary", label: "Emerald (Padrão)" },
    { value: "bg-cyan-500", label: "Cyan" },
    { value: "bg-emerald-600", label: "Emerald Escuro" },
    { value: "bg-teal-500", label: "Teal" },
    { value: "bg-green-500", label: "Verde" },
    { value: "bg-blue-500", label: "Azul" },
  ];

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
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-cyan-500 rounded-lg flex items-center justify-center">
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
                <Calendar className="w-8 h-8 text-emerald-600" />
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

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="events">Eventos</TabsTrigger>
            <TabsTrigger value="projects">Projetos</TabsTrigger>
          </TabsList>

          {/* Events Tab */}
          <TabsContent value="events">
            <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Gerenciar Eventos</CardTitle>
                <CardDescription>
                  Crie, edite e ative eventos para exibir no site
                </CardDescription>
              </div>
              <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={handleNewEvent}
                    className="bg-gradient-to-r from-emerald-600 to-cyan-500 hover:from-emerald-700 hover:to-cyan-600"
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
                        onClick={() => setIsEventDialogOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        disabled={createEventMutation.isPending || updateEventMutation.isPending}
                        className="bg-gradient-to-r from-emerald-600 to-cyan-500 hover:from-emerald-700 hover:to-cyan-600"
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
      </TabsContent>

      {/* Projects Tab */}
      <TabsContent value="projects">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Gerenciar Projetos</CardTitle>
                <CardDescription>
                  Crie, edite e gerencie projetos do portfólio
                </CardDescription>
              </div>
              <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={handleNewProject}
                    className="bg-gradient-to-r from-emerald-600 to-cyan-500 hover:from-emerald-700 hover:to-cyan-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Projeto
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingProject ? "Editar Projeto" : "Criar Novo Projeto"}
                    </DialogTitle>
                    <DialogDescription>
                      Preencha as informações do projeto abaixo
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleSubmitProject(onSubmitProject)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="project-title">Título *</Label>
                        <Input
                          id="project-title"
                          {...registerProject("title")}
                          placeholder="Ex: Sistema de Gestão Empresarial"
                        />
                        {errorsProject.title && (
                          <p className="text-sm text-red-600">{errorsProject.title.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="project-category">Categoria *</Label>
                        <Input
                          id="project-category"
                          {...registerProject("category")}
                          placeholder="Ex: Sistema, E-commerce, Analytics"
                        />
                        {errorsProject.category && (
                          <p className="text-sm text-red-600">{errorsProject.category.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="project-description">Descrição *</Label>
                      <Textarea
                        id="project-description"
                        {...registerProject("description")}
                        placeholder="Descreva o projeto e seus principais benefícios..."
                        rows={3}
                      />
                      {errorsProject.description && (
                        <p className="text-sm text-red-600">{errorsProject.description.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="project-icon">Ícone</Label>
                        <Select value={watchProject("icon")} onValueChange={(value) => setValueProject("icon", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um ícone" />
                          </SelectTrigger>
                          <SelectContent>
                            {iconOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                <div className="flex items-center space-x-2">
                                  {option.icon}
                                  <span>{option.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="project-categoryColor">Cor da Categoria</Label>
                        <Select value={watchProject("categoryColor")} onValueChange={(value) => setValueProject("categoryColor", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma cor" />
                          </SelectTrigger>
                          <SelectContent>
                            {colorOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="project-tags">Tags *</Label>
                      <Input
                        id="project-tags"
                        {...registerProject("tags")}
                        placeholder="Ex: Automação, Dashboard, Relatórios (separadas por vírgula)"
                      />
                      {errorsProject.tags && (
                        <p className="text-sm text-red-600">{errorsProject.tags.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="project-metric">Métrica de Sucesso *</Label>
                      <Input
                        id="project-metric"
                        {...registerProject("metric")}
                        placeholder="Ex: ↗ 70% redução no tempo administrativo"
                      />
                      {errorsProject.metric && (
                        <p className="text-sm text-red-600">{errorsProject.metric.message}</p>
                      )}
                    </div>

                    {/* Multiple Images Upload */}
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="project-images">Imagens do Projeto</Label>
                        <p className="text-sm text-gray-500 mt-1">
                          📐 <strong>Tamanho recomendado:</strong> 800x600px ou proporção 4:3 para melhor visualização
                        </p>
                      </div>

                      {/* Upload by File */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Upload de Arquivo</Label>
                        <div className="flex items-center space-x-4">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploadingImage}
                            className="flex-1"
                          />
                          {uploadingImage && (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          )}
                        </div>
                      </div>

                      {/* Upload by URL */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Adicionar por URL</Label>
                        <div className="flex space-x-2">
                          <Input
                            placeholder="https://exemplo.com/imagem.jpg"
                            value={imageUrlInput}
                            onChange={(e) => setImageUrlInput(e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            onClick={handleAddImageByUrl}
                            variant="outline"
                            disabled={!imageUrlInput.trim()}
                          >
                            Adicionar
                          </Button>
                        </div>
                      </div>

                      {/* Display Current Images */}
                      {projectImages.length > 0 && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Imagens Adicionadas ({projectImages.length})</Label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {projectImages.map((image, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={image.url}
                                  alt={image.alt || `Imagem ${index + 1}`}
                                  className="w-full h-20 object-cover rounded border hover:shadow-md transition-shadow"
                                />
                                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleRemoveImage(index)}
                                    className="w-6 h-6 p-0"
                                  >
                                    ×
                                  </Button>
                                </div>
                                <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1 rounded">
                                  {image.type === "uploaded" ? "📁" : "🔗"}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="project-sortOrder">Ordem de Exibição</Label>
                        <Input
                          id="project-sortOrder"
                          {...registerProject("sortOrder")}
                          placeholder="0"
                          type="number"
                        />
                      </div>

                      <div className="flex items-center space-x-2 mt-6">
                        <Switch
                          id="project-isActive"
                          checked={watchProject("isActive") === "true"}
                          onCheckedChange={(checked) => setValueProject("isActive", checked ? "true" : "false")}
                        />
                        <Label htmlFor="project-isActive">Projeto ativo (visível no site)</Label>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsProjectDialogOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        disabled={createProjectMutation.isPending || updateProjectMutation.isPending}
                        className="bg-gradient-to-r from-emerald-600 to-cyan-500 hover:from-emerald-700 hover:to-cyan-600"
                      >
                        {(createProjectMutation.isPending || updateProjectMutation.isPending) ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          editingProject ? "Atualizar" : "Criar"
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>

          <CardContent>
            {projectsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="ml-2">Carregando projetos...</span>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-8">
                <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum projeto criado
                </h3>
                <p className="text-gray-600 mb-4">
                  Crie seu primeiro projeto para começar
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((project: Project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {project.title}
                          </h3>
                          {project.isActive === "true" ? (
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
                        <p className="text-gray-600 mb-2">{project.category}</p>
                        <p className="text-gray-700 mb-2 line-clamp-2">{project.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Tags: {project.tags}</span>
                          <span className="text-primary font-medium">{project.metric}</span>
                        </div>
                      </div>
                      {(() => {
                        try {
                          const images = JSON.parse(project.images || "[]");
                          return images.length > 0 ? (
                            <div className="ml-4 flex space-x-2">
                              <img
                                src={images[0].url}
                                alt={images[0].alt || project.title}
                                className="w-16 h-16 object-cover rounded border"
                              />
                              {images.length > 1 && (
                                <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded border text-xs text-gray-600">
                                  +{images.length - 1}
                                </div>
                              )}
                            </div>
                          ) : null;
                        } catch (error) {
                          return null;
                        }
                      })()}
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleProjectStatus(project)}
                          disabled={updateProjectMutation.isPending}
                        >
                          {project.isActive === "true" ? (
                            <PowerOff className="w-4 h-4" />
                          ) : (
                            <Power className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProject(project)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteProjectMutation.mutate(project.id)}
                          disabled={deleteProjectMutation.isPending}
                          className="text-red-600 hover:text-red-700"
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
      </TabsContent>
    </Tabs>
      </div>
    </div>
  );
}