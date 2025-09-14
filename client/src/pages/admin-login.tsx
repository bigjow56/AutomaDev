import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, User, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

const loginSchema = z.object({
  username: z.string().min(1, "Usuário é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await apiRequest("POST", "/api/admin/login", data);
      return await response.json();
    },
    onSuccess: (data) => {
      console.log('Login successful:', data);
      
      // Save JWT token for Replit browser compatibility
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        console.log('JWT token saved to localStorage');
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/admin/check"] });
      setLocation("/admin/dashboard");
    },
  });

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-secondary-purple to-primary p-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 300 }}
      >
        <Card className="w-full max-w-md shadow-2xl border-0">
          <CardHeader className="text-center pb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
              className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-primary to-secondary-purple rounded-full flex items-center justify-center"
            >
              <Lock className="w-8 h-8 text-white" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Admin Dashboard
            </CardTitle>
            <CardDescription className="text-gray-600">
              Faça login para gerenciar eventos
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-700">
                  Usuário
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Digite seu usuário"
                    className="pl-10 border-gray-300 focus:border-primary focus:ring-primary"
                    {...register("username")}
                    data-testid="admin-username-input"
                  />
                </div>
                {errors.username && (
                  <p className="text-sm text-red-600">{errors.username.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Digite sua senha"
                    className="pl-10 border-gray-300 focus:border-primary focus:ring-primary"
                    {...register("password")}
                    data-testid="admin-password-input"
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              {loginMutation.error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {(loginMutation.error as any)?.message || "Erro ao fazer login"}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-secondary-purple hover:from-primary-dark hover:to-accent-purple text-white font-semibold py-2 px-4 rounded-md transition-all duration-200 shadow-md hover:shadow-lg"
                disabled={loginMutation.isPending}
                data-testid="admin-login-button"
              >
                {loginMutation.isPending ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Entrando...</span>
                  </div>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="text-center">
            <div className="text-sm text-gray-500 mx-auto">
              <strong>Demo:</strong> admin / 123456
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}