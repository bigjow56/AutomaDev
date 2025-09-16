import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User, Mail, Phone, MapPin, Globe, Linkedin, Github, Edit, Upload, Camera, Save } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Portfolio } from "@shared/schema";
import { useParallax } from "@/hooks/use-scroll";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const portfolioFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  title: z.string().min(1, "Título profissional é obrigatório"),
  bio: z.string().min(1, "Biografia é obrigatória"),
  photo: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  skills: z.string().optional(),
  experience: z.string().optional(),
  education: z.string().optional(),
  certifications: z.string().optional(),
});

type PortfolioForm = z.infer<typeof portfolioFormSchema>;

export default function PortfolioSection() {
  const parallaxOffset = useParallax(-0.15);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  // Fetch portfolio data
  const { data: portfolioData, isLoading } = useQuery<{ success: boolean; portfolio: Portfolio | null }>({
    queryKey: ["/api/portfolio"],
  });

  const portfolio = portfolioData?.portfolio;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PortfolioForm>({
    resolver: zodResolver(portfolioFormSchema),
    defaultValues: {
      name: portfolio?.name || "",
      title: portfolio?.title || "",
      bio: portfolio?.bio || "",
      photo: portfolio?.photo || "",
      email: portfolio?.email || "",
      phone: portfolio?.phone || "",
      location: portfolio?.location || "",
      website: portfolio?.website || "",
      linkedin: portfolio?.linkedin || "",
      github: portfolio?.github || "",
      skills: portfolio?.skills || "[]",
      experience: portfolio?.experience || "[]",
      education: portfolio?.education || "[]",
      certifications: portfolio?.certifications || "[]",
    }
  });

  // Reset form when portfolio data changes
  useEffect(() => {
    if (portfolio) {
      reset({
        name: portfolio.name || "",
        title: portfolio.title || "",
        bio: portfolio.bio || "",
        photo: portfolio.photo || "",
        email: portfolio.email || "",
        phone: portfolio.phone || "",
        location: portfolio.location || "",
        website: portfolio.website || "",
        linkedin: portfolio.linkedin || "",
        github: portfolio.github || "",
        skills: portfolio.skills || "[]",
        experience: portfolio.experience || "[]",
        education: portfolio.education || "[]",
        certifications: portfolio.certifications || "[]",
      });
    }
  }, [portfolio, reset]);

  // Photo upload mutation
  const uploadPhotoMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('photo', file);
      
      const response = await fetch('/api/admin/portfolio/upload-photo', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Erro no upload da foto');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setValue('photo', data.photoUrl);
      toast({
        title: "Foto enviada com sucesso!",
        description: "Sua foto de perfil foi atualizada.",
      });
    },
    onError: () => {
      toast({
        title: "Erro no upload",
        description: "Não foi possível enviar a foto. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  // Save portfolio mutation
  const savePortfolioMutation = useMutation({
    mutationFn: async (data: PortfolioForm) => {
      return await apiRequest("POST", "/api/admin/portfolio", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      setIsEditing(false);
      toast({
        title: "Portfolio salvo com sucesso!",
        description: "Suas informações foram atualizadas.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o portfolio. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingPhoto(true);
      uploadPhotoMutation.mutate(file, {
        onSettled: () => setUploadingPhoto(false),
      });
    }
    e.target.value = '';
  };

  const onSubmit = (data: PortfolioForm) => {
    savePortfolioMutation.mutate(data);
  };

  // Parse JSON arrays safely
  const parseArray = (jsonString: string): string[] => {
    try {
      const arr = JSON.parse(jsonString || "[]");
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  };

  const skills = parseArray(portfolio?.skills || "[]");
  const experience = parseArray(portfolio?.experience || "[]");
  const education = parseArray(portfolio?.education || "[]");

  return (
    <section id="portfolio" className="py-20 bg-dark-secondary relative overflow-hidden">
      {/* Parallax background elements */}
      <motion.div
        className="absolute top-10 right-10 w-28 h-28 bg-primary/10 rounded-full blur-2xl"
        style={{ y: parallaxOffset }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      ></motion.div>
      
      <motion.div
        className="absolute bottom-20 left-10 w-20 h-20 bg-cyan-400/10 rounded-full blur-xl"
        style={{ y: parallaxOffset * -1.2 }}
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.3, 0.6, 0.3],
          x: [0, 25, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      ></motion.div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" data-testid="portfolio-title">
              Sobre Mim
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Conheça minha trajetória profissional e experiência em automação e desenvolvimento
            </p>
          </div>
        </motion.div>

        {/* Portfolio Content */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : portfolio ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card className="bg-dark/80 backdrop-blur-sm border border-dark-tertiary/40 rounded-2xl p-8 hover:border-primary/60 transition-all duration-500">
                <CardContent className="p-0 text-center">
                  {/* Profile Photo */}
                  <div className="relative mb-6">
                    <div className="w-48 h-48 mx-auto rounded-full overflow-hidden bg-dark-tertiary/50 border-4 border-primary/20">
                      {portfolio.photo ? (
                        <img 
                          src={portfolio.photo} 
                          alt={portfolio.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-20 h-20 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Basic Info */}
                  <h3 className="text-2xl font-bold text-white mb-2" data-testid="portfolio-name">
                    {portfolio.name}
                  </h3>
                  <p className="text-primary text-lg font-semibold mb-4" data-testid="portfolio-title">
                    {portfolio.title}
                  </p>

                  {/* Contact Info */}
                  <div className="space-y-3 text-gray-300">
                    {portfolio.email && (
                      <div className="flex items-center justify-center space-x-2">
                        <Mail className="w-4 h-4 text-primary" />
                        <span className="text-sm">{portfolio.email}</span>
                      </div>
                    )}
                    {portfolio.phone && (
                      <div className="flex items-center justify-center space-x-2">
                        <Phone className="w-4 h-4 text-primary" />
                        <span className="text-sm">{portfolio.phone}</span>
                      </div>
                    )}
                    {portfolio.location && (
                      <div className="flex items-center justify-center space-x-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="text-sm">{portfolio.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Social Links */}
                  <div className="flex justify-center space-x-4 mt-6">
                    {portfolio.website && (
                      <a 
                        href={portfolio.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-primary transition-colors"
                      >
                        <Globe className="w-5 h-5" />
                      </a>
                    )}
                    {portfolio.linkedin && (
                      <a 
                        href={portfolio.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-primary transition-colors"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {portfolio.github && (
                      <a 
                        href={portfolio.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-primary transition-colors"
                      >
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Biography & Details */}
            <div className="lg:col-span-2">
              <Card className="bg-dark/80 backdrop-blur-sm border border-dark-tertiary/40 rounded-2xl p-8 hover:border-primary/60 transition-all duration-500 h-full">
                <CardContent className="p-0">
                  <div className="mb-6">
                    <h4 className="text-xl font-bold text-white mb-4">Sobre Mim</h4>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-line" data-testid="portfolio-bio">
                      {portfolio.bio}
                    </p>
                  </div>

                  {/* Skills */}
                  {skills.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-white mb-3">Habilidades</h4>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                          <span 
                            key={index}
                            className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm border border-primary/30"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Experience */}
                  {experience.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-white mb-3">Experiência</h4>
                      <div className="space-y-2">
                        {experience.map((exp, index) => (
                          <p key={index} className="text-gray-300 text-sm">• {exp}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {education.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Educação</h4>
                      <div className="space-y-2">
                        {education.map((edu, index) => (
                          <p key={index} className="text-gray-300 text-sm">• {edu}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-gray-400 mb-6">
              <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Portfolio não configurado</h3>
              <p>Configure suas informações pessoais no painel administrativo.</p>
            </div>
          </motion.div>
        )}

        {/* Edit Button - Only shown to admins */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button
                className="inline-flex items-center bg-primary hover:bg-primary-dark text-white px-6 py-3 font-semibold transition-all duration-300 transform hover:scale-105"
                data-testid="button-edit-portfolio"
              >
                <Edit className="mr-2 w-4 h-4" />
                Editar Portfolio
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Editar Portfolio</DialogTitle>
                <DialogDescription>
                  Configure suas informações pessoais e profissionais
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Photo Upload */}
                <div className="space-y-2">
                  <Label>Foto de Perfil</Label>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                      {watch('photo') ? (
                        <img src={watch('photo')} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Camera className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('photo-upload')?.click()}
                        disabled={uploadingPhoto}
                        className="flex items-center space-x-2"
                      >
                        {uploadingPhoto ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                        <span>Enviar Foto</span>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome *</Label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder="Seu nome completo"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Título Profissional *</Label>
                    <Input
                      id="title"
                      {...register("title")}
                      placeholder="Ex: Desenvolvedor Full-Stack"
                    />
                    {errors.title && (
                      <p className="text-sm text-red-600">{errors.title.message}</p>
                    )}
                  </div>
                </div>

                {/* Biography */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Biografia *</Label>
                  <Textarea
                    id="bio"
                    {...register("bio")}
                    placeholder="Conte sobre sua trajetória profissional, experiências e objetivos..."
                    rows={6}
                  />
                  {errors.bio && (
                    <p className="text-sm text-red-600">{errors.bio.message}</p>
                  )}
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      {...register("phone")}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Localização</Label>
                  <Input
                    id="location"
                    {...register("location")}
                    placeholder="São Paulo, SP - Brasil"
                  />
                </div>

                {/* Social Links */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Links Sociais</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        {...register("website")}
                        placeholder="https://meusite.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        {...register("linkedin")}
                        placeholder="https://linkedin.com/in/seu-perfil"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="github">GitHub</Label>
                      <Input
                        id="github"
                        {...register("github")}
                        placeholder="https://github.com/seu-usuario"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={savePortfolioMutation.isPending}
                    className="flex items-center space-x-2"
                  >
                    {savePortfolioMutation.isPending ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>Salvar</span>
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Button
            onClick={() => scrollToSection("contact")}
            className="inline-flex items-center bg-gradient-to-r from-primary to-secondary-purple hover:from-primary-dark hover:to-accent-purple text-white px-8 py-4 font-bold text-lg transition-all duration-300 transform hover:scale-105"
            data-testid="button-contact-from-portfolio"
          >
            Vamos Conversar?
          </Button>
        </motion.div>
      </div>
    </section>
  );
}