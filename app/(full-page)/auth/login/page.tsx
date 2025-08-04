"use client";
import type { Page } from "@/types";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { useContext, useState } from "react";
import { LayoutContext } from "../../../../layout/context/layoutcontext";

const Login: Page = () => {
    const [usuario, setUsuario] = useState<string>("");
    const [senha, setSenha] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const router = useRouter();
    const { layoutConfig } = useContext(LayoutContext);
    const dark = layoutConfig.colorScheme !== "light";

    const login = async () => {
        if (!usuario || !senha) {
            alert("Preencha o email e a senha.");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    usuario: usuario,
                    senha: senha,
                    dias: rememberMe
                })
            });

            if (!res.ok) {
                if (res.status === 401) {
                    alert("Credenciais inválidas!");
                } else {
                    const err = await res.json();
                    alert(err.error || "Erro no login");
                }
                return;
            }

            // Login bem-sucedido
            const data = await res.json();
            console.log("Login:", data);

            // Redirecionar para home ou dashboard
            router.push("/");
        } catch (error) {
            console.error("Erro de rede:", error);
            alert("Erro ao tentar fazer login");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="px-5 min-h-screen flex justify-content-center align-items-center flex flex-column">
            <div className="border-1 my-8 border-primary surface-card border-round py-7 px-4 md:px-7 z-1">
                <div className="mb-4">
                    <div className="text-900 text-xl text-primary font-bold mb-2">
                        Login
                    </div>
                    <span className="text-800 font-medium">
                        Insira os dados de login abaixo:
                    </span>
                </div>
                <div className="flex flex-column">
                    <span className="p-input-icon-left w-full mb-4">
                        <i className="pi pi-envelope"></i>
                        <InputText
                            id="email"
                            type="text"
                            className="w-full md:w-25rem"
                            placeholder="Email"
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                        />
                    </span>

                    <span className="p-input-icon-left w-full mb-4">
                        <i className="pi pi-lock"></i>
                        <InputText
                            id="password"
                            type="password"
                            className="w-full md:w-25rem"
                            placeholder="Senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                        />
                    </span>

                    <div className="mb-4 flex flex-wrap gap-3">
                        <div>
                            <Checkbox
                                name="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.checked ?? false)}
                                className="mr-2"
                            ></Checkbox>
                            <label htmlFor="checkbox" className="text-900 font-medium mr-8">
                                Lembrar de mim
                            </label>
                        </div>
                    </div>

                    <Button
                        label="Log In"
                        icon={`${isLoading && "pi pi-spin pi-spinner"}`}
                        className="w-full bg-primary text-white border-none"
                        onClick={login}
                        disabled={isLoading}
                    ></Button>
                </div>
            </div>
        </div>
    );
};

export default Login;
