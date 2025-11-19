"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { ApiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { platforms, genres } from "@/lib/data";
import { Loader2, Upload } from "lucide-react";

export default function NewProductPage() {
  const router = useRouter();
  const { token } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    platformId: "",
    genreId: "",
    type: "Digital",
    developer: "",
    imageUrl: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await ApiClient.createProduct(formData, token || undefined);
      
      toast({
        title: "Producto creado",
        description: "El producto se ha añadido al catálogo correctamente.",
      });
      
      router.push("/productos"); // Redirigir al catálogo
      router.refresh();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "No se pudo crear el producto.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Añadir Nuevo Producto</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Juego</Label>
              <Input id="name" name="name" placeholder="Ej: Super Game 64" required value={formData.name} onChange={handleChange} />
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea id="description" name="description" placeholder="Describe el juego..." required value={formData.description} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Precio */}
              <div className="space-y-2">
                <Label htmlFor="price">Precio ($)</Label>
                <Input id="price" name="price" type="number" min="0" step="0.01" required value={formData.price} onChange={handleChange} />
              </div>

              {/* Stock */}
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Inicial</Label>
                <Input id="stock" name="stock" type="number" min="0" required value={formData.stock} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Plataforma */}
              <div className="space-y-2">
                <Label>Plataforma</Label>
                <Select onValueChange={(val) => handleSelectChange("platformId", val)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Género */}
              <div className="space-y-2">
                <Label>Género</Label>
                <Select onValueChange={(val) => handleSelectChange("genreId", val)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    {genres.map((g) => (
                      <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               {/* Tipo */}
               <div className="space-y-2">
                <Label>Formato</Label>
                <Select onValueChange={(val) => handleSelectChange("type", val)} defaultValue="Digital">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Digital">Digital (Clave)</SelectItem>
                    <SelectItem value="Physical">Físico</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Desarrollador */}
              <div className="space-y-2">
                <Label htmlFor="developer">Desarrollador</Label>
                <Input id="developer" name="developer" placeholder="Ej: Nintendo" required value={formData.developer} onChange={handleChange} />
              </div>
            </div>

            {/* URL de Imagen */}
            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL de la Imagen</Label>
              <Input id="imageUrl" name="imageUrl" placeholder="https://..." value={formData.imageUrl} onChange={handleChange} />
              <p className="text-xs text-muted-foreground">Pega una URL directa a una imagen (JPG/PNG).</p>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Publicar Producto
                </>
              )}
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}