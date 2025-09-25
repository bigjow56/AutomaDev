import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { MessageSquare, Mail, ExternalLink } from "lucide-react";
import type { InsertContact } from "@shared/schema";
import { useParallax } from "@/hooks/use-scroll";

export default function ContactSection() {
  const parallaxOffset = useParallax(0.2);

  const [formData, setFormData] = useState<InsertContact>({
    name: "",
    email: "",
    company: "",
    service: "",
    message: "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const contactMutation = useMutation({
    mutationFn: async (data: InsertContact) => {
      return apiRequest("POST", "/api/contacts", data);
    },
    onSuccess: () => {
      toast({
        title: "Mensagem enviada!",
        description: "Obrigado pelo contato. Retornaremos em breve!",
      });
      setFormData({
        name: "",
        email: "",
        company: "",
        service: "",
        message: "",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
    },
    onError: () => {
      toast({
        title: "Erro ao enviar mensagem",
        description: "Tente novamente ou entre em contato via WhatsApp.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.service || !formData.message) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    contactMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof InsertContact, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section id="contact" className="py-20 bg-dark relative overflow-hidden">
      {/* Parallax background elements */}
      <motion.div
        className="absolute top-16 left-16 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"
        style={{ y: parallaxOffset }}
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.3, 0.6, 0.3],
          rotate: [0, 90, 180],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      ></motion.div>
      
      <motion.div
        className="absolute bottom-16 right-16 w-32 h-32 bg-purple-400/10 rounded-full blur-2xl"
        style={{ y: parallaxOffset * -0.8 }}
        animate={{
          scale: [1.3, 1, 1.3],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 4,
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
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" data-testid="contact-title">
            Vamos Conversar?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Pronto para automatizar seu negócio e criar uma presença online profissional?
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Contact Info */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="text-card-foreground shadow-sm backdrop-blur-sm border border-dark-tertiary/40 rounded-2xl p-8 bg-[#0c0c0c]">
              <CardContent className="p-0">
                <h3 className="text-2xl font-bold text-white mb-6" data-testid="contact-info-title">
                  Entre em Contato Agora
                </h3>
                <p className="text-gray-300 mb-8 leading-relaxed">
                  Nossa equipe está pronta para entender suas necessidades e desenvolver soluções personalizadas para seu negócio.
                </p>

                {/* Contact Methods */}
                <div className="space-y-6">
                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/5511999999999"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-4 bg-green-500/10 border border-green-500/20 rounded-xl hover:border-green-500/40 transition-all duration-300 group"
                    data-testid="link-whatsapp"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:bg-green-500/30 transition-all duration-300">
                        <MessageSquare className="w-6 h-6 text-green-400" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-white">WhatsApp</h4>
                      <p className="text-gray-300">Resposta rápida via WhatsApp</p>
                    </div>
                    <div className="ml-auto">
                      <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors duration-300" />
                    </div>
                  </a>

                  {/* Email */}
                  <a
                    href="mailto:contato@automadev.com"
                    className="flex items-center p-4 bg-primary/10 border border-primary/20 rounded-xl hover:border-primary/40 transition-all duration-300 group"
                    data-testid="link-email"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center group-hover:bg-primary/30 transition-all duration-300">
                        <Mail className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-white">Email</h4>
                      <p className="text-gray-300">contato@automadev.com</p>
                    </div>
                    <div className="ml-auto">
                      <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-300" />
                    </div>
                  </a>
                </div>

                {/* Features */}
                <div className="mt-8 pt-8 border-t border-dark-tertiary/30">
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                      Consultoria gratuita
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                      Resposta em 24h
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                      Orçamento sem compromisso
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                      Suporte especializado
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="text-card-foreground shadow-sm border border-dark-tertiary/50 rounded-2xl p-8 bg-[#0c0c0c]">
              <CardContent className="p-0">
                <h3 className="text-2xl font-bold text-white mb-6" data-testid="contact-form-title">
                  Solicite uma Proposta
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium text-gray-300 mb-2">
                        Nome *
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="bg-[#1e1e1e] border-dark-tertiary/30 text-white placeholder-gray-500 focus:border-primary"
                        placeholder="Seu nome"
                        required
                        data-testid="input-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-300 mb-2">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="bg-[#1e1e1e] border-dark-tertiary/30 text-white placeholder-gray-500 focus:border-primary"
                        placeholder="seu@email.com"
                        required
                        data-testid="input-email"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="company" className="text-sm font-medium text-gray-300 mb-2">
                      Empresa
                    </Label>
                    <Input
                      id="company"
                      type="text"
                      value={formData.company || ""}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      className="bg-[#1e1e1e] border-dark-tertiary/30 text-white placeholder-gray-500 focus:border-primary"
                      placeholder="Nome da sua empresa"
                      data-testid="input-company"
                    />
                  </div>

                  <div>
                    <Label htmlFor="service" className="text-sm font-medium text-gray-300 mb-2">
                      Serviço de Interesse *
                    </Label>
                    <Select
                      value={formData.service}
                      onValueChange={(value) => handleInputChange("service", value)}
                      required
                    >
                      <SelectTrigger 
                        className="bg-[#1e1e1e] border-dark-tertiary/30 text-white focus:border-primary"
                        data-testid="select-service"
                      >
                        <SelectValue placeholder="Selecione um serviço" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1e1e1e] border-dark-tertiary/30 text-white">
                        <SelectItem value="automation">Automação de Processos</SelectItem>
                        <SelectItem value="website">Criação de Sites</SelectItem>
                        <SelectItem value="integration">Integração de Sistemas</SelectItem>
                        <SelectItem value="consultation">Consultoria</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-sm font-medium text-gray-300 mb-2">
                      Mensagem *
                    </Label>
                    <Textarea
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      className="bg-[#1e1e1e] border-dark-tertiary/30 text-white placeholder-gray-500 focus:border-primary resize-none"
                      placeholder="Conte-nos mais sobre seu projeto..."
                      required
                      data-testid="textarea-message"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={contactMutation.isPending}
                    className="w-full purple-gradient-button hover:from-primary-dark hover:to-secondary-purple-dark text-white px-8 py-4 font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-purple hover:shadow-purple-lg"
                    data-testid="button-submit-contact"
                  >
                    {contactMutation.isPending ? "Enviando..." : "Enviar Mensagem"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
