import React from "react";
import { Card, Container } from "../components/ui";

function AboutPage() {
    return (
        <Container className="py-10">
            <Card className="p-8">
                <h1 className="text-center font-bold text-3xl md:text-4xl text-emerald-400">
                    Sobre esta aplicación
                </h1>

                <p className="mt-6 leading-relaxed text-slate-300">
                    Esta app es un ejemplo práctico construido con el stack{" "}
                    <span className="font-semibold text-emerald-400">PERN</span> —{" "}
                    PostgreSQL, Express, React y Node.js — para gestionar tareas con autenticación de usuario.
                    El objetivo es ofrecer una base moderna, simple y extensible.
                </p>

                <h2 className="text-2xl mt-8 mb-3 text-slate-200">Tecnologías</h2>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                    <li><span className="text-emerald-400 font-semibold">PostgreSQL:</span> base de datos relacional.</li>
                    <li><span className="text-emerald-400 font-semibold">Express.js:</span> API REST y middleware.</li>
                    <li><span className="text-emerald-400 font-semibold">React:</span> interfaz de usuario.</li>
                    <li><span className="text-emerald-400 font-semibold">Node.js:</span> servidor y lógica backend.</li>
                    <li><span className="text-emerald-400 font-semibold">JWT:</span> sesiones seguras.</li>
                </ul>

                <h2 className="text-2xl mt-8 mb-3 text-slate-200">Configuración general</h2>
                <ol className="list-decimal list-inside space-y-1 text-slate-300">
                    <li>Levantar la base de datos y tablas.</li>
                    <li>Configurar variables de entorno para la API.</li>
                    <li>Ejecutar frontend y backend en desarrollo.</li>
                </ol>

                <div className="mt-10 border-t border-slate-800/60 pt-6 text-center">
                    <p className="text-slate-300">
                        Proyecto desarrollado por{" "}
                        <span className="font-semibold text-emerald-400">Gabriel Valdés</span>.
                    </p>

                    <div className="flex justify-center items-center gap-2 mt-3">
                        <a
                            href="https://github.com/bkt93"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition"
                        >
                            {/* ícono de GitHub */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                className="h-5 w-5"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M12 .5C5.649.5.5 5.648.5 12c0 5.089 3.292 9.394 7.865 10.915.575.105.785-.25.785-.555
                                    0-.274-.01-1.002-.015-1.967-3.2.695-3.877-1.544-3.877-1.544-.523-1.329-1.278-1.683-1.278-1.683-1.045-.715.08-.7.08-.7
                                    1.155.082 1.762 1.186 1.762 1.186 1.028 1.763 2.695 1.254 3.352.96.104-.744.403-1.255.733-1.543-2.553-.29-5.236-1.276-5.236-5.68
                                    0-1.255.45-2.282 1.186-3.086-.119-.29-.514-1.459.112-3.042 0 0 .967-.31 3.17 1.18a10.98 10.98 0 0 1 2.884-.388c.979.005 1.964.132 2.884.388
                                    2.2-1.49 3.164-1.18 3.164-1.18.628 1.583.233 2.752.114 3.042.74.804 1.185 1.831 1.185 3.086
                                    0 4.418-2.688 5.385-5.25 5.67.415.357.784 1.062.784 2.142
                                    0 1.547-.014 2.794-.014 3.176 0 .308.206.667.79.553C20.712 21.388 24 17.086 24 12
                                    24 5.648 18.851.5 12 .5Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span>github.com/bkt93</span>
                        </a>
                    </div>
                </div>

            </Card>
        </Container>
    );
}
export default AboutPage;
