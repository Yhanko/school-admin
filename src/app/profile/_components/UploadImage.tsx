"use client";

import React, { useState } from "react";
import axios from "axios";
import axiosInstance from "@/service/api";
import { Camera, Loader2 } from "@/lib/icons";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/store/useAuth";

interface ImageUploadButtonProps {
  onSuccess?: (photoUrl: string) => void;
}

export function ImageUploadButton({ onSuccess }: ImageUploadButtonProps) {
  const { toast } = useToast();
  const { updateUser } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Ficheiro inválido",
        description: "Por favor selecione um ficheiro de imagem válido (JPG, PNG, WebP).",
        variant: "destructive",
      });
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Imagem demasiado grande",
        description: "O tamanho máximo permitido para a foto de perfil é de 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      let uploadedUrl = "";
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      // Option A: Direct upload to Cloudinary if client env vars are provided
      if (cloudName && uploadPreset) {
        try {
          const directForm = new FormData();
          directForm.append("file", file);
          directForm.append("upload_preset", uploadPreset);

          const directRes = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            directForm
          );
          uploadedUrl = directRes.data.secure_url || directRes.data.url;
        } catch (directErr) {
          console.warn("Falha no upload direto ao Cloudinary, tentando backend...", directErr);
        }
      }

      // Option B: Upload through backend Cloudinary endpoint (/uploads/cloudinary)
      if (!uploadedUrl) {
        const formData = new FormData();
        formData.append("file", file);

        const extractUrl = (data: any): string => {
          if (!data) return "";
          if (typeof data === "string" && data.startsWith("http")) return data;
          return (
            data.path ||
            data.url ||
            data.secure_url ||
            data.fileUrl ||
            data.photoUrl ||
            data.location ||
            data.data?.url ||
            data.data?.path ||
            data.data?.secure_url ||
            ""
          );
        };

        try {
          const response = await axiosInstance.post("/uploads/cloudinary", formData);
          uploadedUrl = extractUrl(response.data);
        } catch (err1) {
          console.warn("Falha no /uploads/cloudinary, tentando /uploads...", err1);
          try {
            const fallbackRes = await axiosInstance.post("/uploads", formData);
            uploadedUrl = extractUrl(fallbackRes.data);
          } catch (err2) {
            console.warn("Falha no /uploads, tentando /users/me/photo...", err2);
            try {
              const photoRes = await axiosInstance.post("/users/me/photo", formData);
              uploadedUrl = extractUrl(photoRes.data);
            } catch (err3) {
              const errorObj = err1 as { response?: { data?: { message?: string } } };
              const errorMsg =
                errorObj.response?.data?.message ||
                "O backend retornou erro 500 ao enviar para o Cloudinary. Verifique se o serviço no Railway foi reiniciado após adicionar as variáveis CLOUDINARY_CLOUD_NAME (ou CLOUDINARY_NAME), CLOUDINARY_API_KEY e CLOUDINARY_API_SECRET.";
              throw new Error(errorMsg);
            }
          }
        }
      }

      if (!uploadedUrl) {
        throw new Error("Não foi possível obter a URL da imagem após o upload.");
      }

      // 2. Persist the Cloudinary image URL in the database for current user
      try {
        await axiosInstance.patch("/users/me", {
          avatar: uploadedUrl,
          photoUrl: uploadedUrl,
          profile: {
            photoUrl: uploadedUrl,
          },
          employeeProfile: {
            photoUrl: uploadedUrl,
          },
        });
      } catch (patchErr) {
        console.warn("Falha no PATCH /users/me composto, tentando com avatar...", patchErr);
        await axiosInstance.patch("/users/me", {
          avatar: uploadedUrl,
        });
      }

      // 3. Update global Auth store and cookies
      updateUser({
        photoUrl: uploadedUrl,
        profile: {
          photoUrl: uploadedUrl,
        },
      });

      // 4. Notify parent if callback provided
      if (onSuccess) {
        onSuccess(uploadedUrl);
      }

      toast({
        title: "Foto de perfil atualizada!",
        description: "A sua nova foto foi guardada com sucesso no Cloudinary e na base de dados.",
      });
    } catch (error) {
      console.error("Erro ao fazer upload da foto de perfil:", error);
      const err = error as { message?: string; response?: { data?: { message?: string } } };
      toast({
        title: "Erro ao atualizar foto",
        description:
          err.response?.data?.message ||
          err.message ||
          "Não foi possível enviar a imagem para o Cloudinary.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      uploadImage(file);
    }
    // reset input to allow uploading same file again if wanted
    e.target.value = "";
  };

  return (
    <div className="relative">
      <button
        type="button"
        disabled={isUploading}
        onClick={() => document.getElementById("profilePhotoInput")?.click()}
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#8B5CF6] hover:bg-[#A78BFA] text-black flex items-center justify-center shadow-[0_0_12px_rgba(139, 92, 246,0.5)] border-2 border-[#131313] transition-transform hover:scale-105 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
        title="Alterar foto de perfil"
      >
        {isUploading ? (
          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
        ) : (
          <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
        )}
      </button>

      <input
        type="file"
        id="profilePhotoInput"
        onChange={handleImageChange}
        style={{ display: "none" }}
        accept="image/png, image/jpeg, image/jpg, image/webp"
      />
    </div>
  );
}
