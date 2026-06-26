"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FormEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { TRAINING_TIPS } from "@/lib/training-tips";

type Step = "email" | "otp" | "register";

export default function AuthPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [registrationToken, setRegistrationToken] = useState("");
  const [name, setName] = useState("");
  const [academiaNome, setAcademiaNome] = useState("");
  const [academiaCidade, setAcademiaCidade] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tipIndex, setTipIndex] = useState(0);
  const [tipVisible, setTipVisible] = useState(true);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step !== "email") return;

    const interval = setInterval(() => {
      setTipVisible(false);
      setTimeout(() => {
        setTipIndex((current) => (current + 1) % TRAINING_TIPS.length);
        setTipVisible(true);
      }, 400);
    }, 4000);

    return () => clearInterval(interval);
  }, [step]);

  const handleEmailChange = (value: string) => {
    setEmail(value.trim().toLowerCase());
    setError("");
  };

  const sendOtp = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = (await res.json()) as { error?: string; success?: boolean };

      if (!res.ok) {
        setError(data.error ?? "Erro ao enviar código");
        return;
      }

      const [local, domain] = email.split("@");
      const masked =
        local && domain
          ? `${local.length <= 2 ? `${local[0]}*` : `${local.slice(0, 2)}***`}@${domain}`
          : email;
      setMaskedEmail(masked);
      setOtp(["", "", "", "", "", ""]);
      setStep("otp");
      setTimeout(() => otpRefs.current[0]?.focus(), 300);
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    await sendOtp();
  };

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setError("");

    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const next = pasted.split("").concat(Array(6).fill("")).slice(0, 6);
    setOtp(next);
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const verifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    const code = otp.join("");

    if (code.length !== 6) {
      setError("Digite os 6 dígitos do código");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = (await res.json()) as {
        error?: string;
        exists?: boolean;
        registrationToken?: string;
      };

      if (!res.ok) {
        setError(data.error ?? "Código inválido");
        return;
      }

      if (data.exists) {
        router.push("/home");
        return;
      }

      setRegistrationToken(data.registrationToken ?? "");
      setStep("register");
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationToken,
          name,
          academia_nome: academiaNome,
          academia_cidade: academiaCidade,
        }),
      });

      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        setError(data.error ?? "Erro ao completar cadastro");
        return;
      }

      router.push("/home");
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const goBack = useCallback(() => {
    setError("");
    if (step === "otp") {
      setStep("email");
      return;
    }
    if (step === "register") {
      setStep("otp");
    }
  }, [step]);

  return (
    <>
      <style>{`
        @keyframes step-enter {
          from {
            opacity: 0;
            transform: translateX(16px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .step-enter {
          animation: step-enter 0.35s ease-out forwards;
        }
      `}</style>

      <main className="relative flex min-h-screen flex-col bg-iron-bg px-6 pb-10 pt-6">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
          {/* Header */}
          <div className="relative mb-10 flex items-center justify-center">
            {step !== "email" && (
              <button
                type="button"
                onClick={goBack}
                aria-label="Voltar"
                className="absolute left-0 flex h-10 w-10 items-center justify-center text-xl text-iron-primary transition-opacity hover:opacity-80"
              >
                ←
              </button>
            )}

            <Link href="/" className="font-black uppercase tracking-tighter">
              <span className="text-lg text-white">IRON</span>
              <span className="text-lg text-iron-primary">LOG</span>
            </Link>
          </div>

          {/* Passo 1 — Email */}
          {step === "email" && (
            <form onSubmit={handleSendOtp} className="step-enter flex flex-1 flex-col">
              <h1 className="text-center text-xl font-black uppercase tracking-wide text-white">
                SEU EMAIL
              </h1>
              <p className="mt-3 text-center text-base font-semibold text-iron-primary">
                Você receberá um código pelo email
              </p>

              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                className="mt-10 w-full border-2 border-iron-primary bg-transparent px-4 py-4 text-lg font-semibold text-white outline-none placeholder:text-[#666666] transition-colors focus:border-iron-primary"
              />

              {error && (
                <p className="mt-4 text-center text-sm text-red-400">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-8 w-full border-2 border-iron-primary bg-iron-primary py-4 text-sm font-black uppercase tracking-widest text-black transition-all hover:bg-transparent hover:text-iron-primary disabled:opacity-50"
              >
                {loading ? "Enviando..." : "Enviar código"}
              </button>

              <div className="mt-8 border-t border-iron-primary pt-6">
                <p className="text-xs font-bold uppercase tracking-widest text-iron-primary">
                  Dica do dia
                </p>
                <div
                  className={`mt-4 flex items-start gap-3 transition-opacity duration-500 ease-in-out ${
                    tipVisible ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <span className="shrink-0 text-lg leading-none" aria-hidden="true">
                    {TRAINING_TIPS[tipIndex].emoji}
                  </span>
                  <p className="text-sm text-white">{TRAINING_TIPS[tipIndex].text}</p>
                </div>
              </div>
            </form>
          )}

          {/* Passo 2 — OTP */}
          {step === "otp" && (
            <form onSubmit={verifyOtp} className="step-enter flex flex-1 flex-col">
              <h1 className="text-center text-xl font-black uppercase tracking-wide text-white">
                Confirme seu código
              </h1>
              <p className="mt-3 text-center text-sm text-iron-secondary">
                Código enviado para {maskedEmail || email}
              </p>

              <div className="mt-10 flex justify-center gap-2 sm:gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      otpRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={handleOtpPaste}
                    className="h-14 w-11 border-2 border-iron-secondary bg-transparent text-center text-xl font-black text-white outline-none transition-colors focus:border-iron-primary sm:h-16 sm:w-12"
                  />
                ))}
              </div>

              {error && (
                <p className="mt-4 text-center text-sm text-red-400">{error}</p>
              )}

              <button
                type="button"
                onClick={sendOtp}
                disabled={loading}
                className="mt-6 text-center text-sm font-semibold text-iron-primary underline-offset-4 hover:underline disabled:opacity-50"
              >
                Reenviar código
              </button>

              <button
                type="submit"
                disabled={loading}
                className="mt-auto w-full border-2 border-iron-primary bg-iron-primary py-4 text-sm font-black uppercase tracking-widest text-black transition-all hover:bg-transparent hover:text-iron-primary disabled:opacity-50"
              >
                {loading ? "Verificando..." : "Verificar"}
              </button>
            </form>
          )}

          {/* Passo 3 — Cadastro */}
          {step === "register" && (
            <form onSubmit={handleRegister} className="step-enter flex flex-1 flex-col">
              <h1 className="text-center text-xl font-black uppercase tracking-wide text-white">
                Complete seu perfil
              </h1>

              <div className="mt-10 space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-iron-secondary">
                    Nome completo
                  </label>
                  <input
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border-2 border-iron-secondary bg-transparent px-4 py-3 text-white outline-none transition-colors focus:border-iron-primary"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-iron-secondary">
                    Onde você treina? <span className="font-normal">(opcional)</span>
                  </label>
                  <input
                    type="text"
                    value={academiaNome}
                    onChange={(e) => setAcademiaNome(e.target.value)}
                    placeholder="Nome da academia"
                    className="w-full border-2 border-iron-secondary bg-transparent px-4 py-3 text-white outline-none transition-colors focus:border-iron-primary"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-iron-secondary">
                    Cidade <span className="font-normal">(opcional)</span>
                  </label>
                  <input
                    type="text"
                    value={academiaCidade}
                    onChange={(e) => setAcademiaCidade(e.target.value)}
                    placeholder="Sua cidade"
                    className="w-full border-2 border-iron-secondary bg-transparent px-4 py-3 text-white outline-none transition-colors focus:border-iron-primary"
                  />
                </div>
              </div>

              {error && (
                <p className="mt-4 text-center text-sm text-red-400">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-auto w-full border-2 border-iron-primary bg-iron-primary py-4 text-sm font-black uppercase tracking-widest text-black transition-all hover:bg-transparent hover:text-iron-primary disabled:opacity-50"
              >
                {loading ? "Salvando..." : "Começar a treinar"}
              </button>
            </form>
          )}
        </div>
      </main>
    </>
  );
}
