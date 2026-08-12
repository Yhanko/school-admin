import getCookie from "../hooks/Hooks/Login/useGetTokenLogin";
import axiosInstance from "@/service/api";
import { UserDataType } from "../types/types";
import env from "../config/env";

export const userData = async (): Promise<{ user: UserDataType; userLogo: string } | null> => {
    const { hash, master } = getCookie();

    try {
        let response;

        if (master) {
            response = await axiosInstance.get(`/clientes/hash/${hash}`);
        } else {
            response = await axiosInstance.get(`/afiliados/hash/${hash}`);
        }

        if (response?.status === 200) {
            const data = response.data.mensagem;

            // Padronizar para o tipo UserDataType
            const user: UserDataType = master
                ? {
                    id: data.id,
                    email: data.email,
                    contacto: data.contacto,
                    cadastrado_em: data.cadastrado_em,
                    ultimo_login: data.ultimo_login,
                    nome_empresa: data.nome_empresa,
                    logo: data.logo,
                    nif: data.nif,
                    arquivo_do_contrato: data.arquivo_do_contrato
                }
                : {
                    id: data.id_afiliado,
                    email: data.email_afiliado || "",
                    contacto: "", // afiliado não tem contacto
                    cadastrado_em: data.gerado_em_ || "",
                    ultimo_login: data.ultimo_login_afiliado || "",
                    nome_empresa: data.nome_afiliado,
                    logo: data.logo || "default.jpg", // garantir imagem mesmo que não tenha
                    nif: "", // afiliado não tem nif
                    arquivo_do_contrato: "" // afiliado não tem contrato
                };

            const baseUrl = (env.API_BASE_URL || "").replace(/\/$/, "");
            const userLogo: string = `${baseUrl}/images/${user.logo}`;

            return { user, userLogo };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        return null;
    }
};

/*
export const userData = async (): Promise<{ user: UserDataType; userLogo: string } | null> => {
    let response = null;
    
    // Obtém o hash e a variável master do cookie
    const { hash, master } = getCookie();

    try {
        // Verifica se é master
        if (master) {
            // Se master for true, busca os dados do cliente
            response = await axiosInstance.get(`/clientes/hash/${hash}`);
        } else {
            // Se master for false, busca os dados do afiliado
            response = await axiosInstance.get(`/afiliados/hash/${hash}`);
            console.log(response.data.mensagem.nome_afiliado)
        }

        // Se a resposta for bem-sucedida (status 200), extraímos os dados
        if (response && response.status === 200) {
            const data = response.data.mensagem;
            const user: UserDataType = data;

            // Monta a URL do logo do usuário
            const userLogo: string = `${env.API_BASE_URL}images/${user.logo}`;

            return { user, userLogo };
        } 

    } catch { 
        return null;
    }
};
*/
